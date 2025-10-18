import { array } from "@hgargg-0710/one"
import type {
	ICellNode,
	INode,
	IOwnedStream,
	IPoolNode,
	IStreamChooser,
	ITypeCheckable
} from "../../../interfaces.js"
import { SourceBuilder } from "../../../objects.js"
import {
	LimitStream,
	SingleNodeStream,
	SingletonStream
} from "../../../objects/Stream.js"
import { isDecimal } from "../../../samples/alphabet.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../../samples/Stream.js"
import { consumable, next } from "../../../utils/Stream.js"
import {
	CommaNode,
	GreedyRange,
	InfiniteRange,
	LimitsRange,
	NonGreedyRange,
	QMark,
	Range,
	RangeBoundary,
	TrivialRange
} from "../Nodes.js"

const CommaNodeStream = SingletonStream(() => new CommaNode())

const RangeLimitStream = EndBracketStream(isCurr("}"))

const RangeBoundaryLimitStream = LimitStream((input: IOwnedStream<string>) =>
	isDecimal(input.curr)
)

const RangeBoundaryStream = CollectionStream(
	RangeBoundary,
	consumable(new SourceBuilder())
)

class RangeStream extends SingleNodeStream<IPoolNode<string, [INode<string>]>> {
	private finalRange: IPoolNode<string, [INode<string>]>
	private firstItem: ICellNode<string>
	private lastItem: ICellNode<string>

	private tryTrivial() {
		this.firstItem = this.resource!.curr as ICellNode<string>
		this.resource!.next() // skipping first item
		return this.reviveChild()
	}

	private asTrivial() {
		this.finalRange.init(new TrivialRange(this.firstItem))
		this.resource!.next() // killing last child
		// ! VALIDATE THAT THE CHILD IS INDEED LAST!!!
	}

	private asInfinite() {
		this.finalRange.init(new InfiniteRange(this.firstItem))
	}

	private tryLimits() {
		this.resource!.next() // skipping second item
		return this.reviveChild()
	}

	private asLimits() {
		this.lastItem = this.resource!.curr
		this.finalRange.init(new LimitsRange(this.firstItem, this.lastItem))
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.finalRange = new Range()
		this.curr = this.finalRange

		// ! THIS MUST LATER BE VERIFIED!!! [we don't *know* what are the tyep that are stored in the `readItems`]:
		// * only 3 formats: 'number', 'number,' and 'number,number' are allowed
		if (this.tryTrivial()) this.asTrivial()
		else if (this.tryLimits()) this.asLimits()
		else this.asInfinite()
	}
}

function HandleComma(input: IOwnedStream<string>) {
	input.next() // ,
	return [CommaNodeStream()]
}

function HandleDecimalOrComma(input: IOwnedStream<string>) {
	return isDecimal(input.curr)
		? [RangeBoundaryStream(), RangeBoundaryLimitStream()]
		: HandleComma(input)
}

export function HandleRange(input: IOwnedStream<string>) {
	input.next() // {
	return [new RangeStream(), HandleDecimalOrComma, RangeLimitStream()]
}

function handleRangeAfterItem(input: IOwnedStream<INode<string>>) {
	const child = next(input) // the thing onto which the range quantifier is applied
	const range = next(input) as IPoolNode<string, [INode<string>]> // Range({...})
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyRange(child, range))()]
	}
	return [SingletonStream(() => new GreedyRange(child, range))()]
}

export const maybeRange: array.Pairs<ITypeCheckable, IStreamChooser> = [
	[Range, handleRangeAfterItem]
]

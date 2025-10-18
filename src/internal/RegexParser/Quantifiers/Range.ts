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
import { ensureChildUnrevivable, expect, expectKind } from "../../../objects/Error.js"
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
	Comma,
	GreedyRange,
	InfiniteRange,
	LimitsRange,
	NonGreedyRange,
	QMark,
	Range,
	RangeBoundary,
	TrivialRange
} from "../Nodes.js"

const CommaNodeStream = SingletonStream(() => new Comma())

const RangeLimitStream = EndBracketStream(isCurr("}"))

const RangeBoundaryLimitStream = LimitStream((input: IOwnedStream<string>) =>
	isDecimal(input.curr)
)

const RangeBoundaryStream = CollectionStream(
	RangeBoundary,
	consumable(new SourceBuilder())
)

const expectRangeBoundary = expectKind(RangeBoundary)
const expectCommaNode = expectKind(Comma)
const expectComma = expect(",")

class RangeStream extends SingleNodeStream<IPoolNode<string, [INode<string>]>> {
	private finalRange: IPoolNode<string, [INode<string>]>
	private first: ICellNode<string>
	private last: ICellNode<string>

	private tryTrivial() {
		expectRangeBoundary(this.resource!)
		this.first = this.resource!.curr as ICellNode<string>
		this.resource!.next() // skipping first item
		return !this.reviveChild() // does this die after 1st?
	}

	private asTrivial() {
		this.finalRange.init(new TrivialRange(this.first))
		this.resource!.next() // killing last (1st here) child
	}

	private asInfinite() {
		this.finalRange.init(new InfiniteRange(this.first))
	}

	private tryLimits() {
		expectCommaNode(this.resource!)
		this.resource!.next() // skipping 2nd item (Comma)
		return this.reviveChild() // is this alive for the 3rd?
	}

	private asLimits() {
		expectRangeBoundary(this.resource!)
		this.last = this.resource!.curr
		this.finalRange.init(new LimitsRange(this.first, this.last))
		ensureChildUnrevivable(this) // we're definitely finished, no weird leftovers
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this.finalRange = new Range()
		this.curr = this.finalRange

		if (this.tryTrivial()) this.asTrivial()
		else if (this.tryLimits()) this.asLimits()
		else this.asInfinite()
	}
}

function HandleComma(input: IOwnedStream<string>) {
	expectComma(input)
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

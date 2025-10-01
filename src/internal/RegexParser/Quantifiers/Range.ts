import { array } from "@hgargg-0710/one"
import { SourceBuilder } from "../../../classes.js"
import {
	BaseNode,
	ContentNode,
	SingleChildNode,
	TokenNode
} from "../../../classes/Node.js"
import {
	LimitStream,
	NodeStream,
	SingletonStream
} from "../../../classes/Stream.js"
import type {
	ICellNode,
	INode,
	IOwnedStream,
	IStreamChooser,
	ITypeCheckable
} from "../../../interfaces.js"
import { isDecimal } from "../../../samples/alphabet.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../../samples/Stream.js"
import { consumable, next } from "../../../utils/Stream.js"
import { QMark } from "./QMark.js"

const InfiniteRange = SingleChildNode<string>("infinite-range")

const TrivialRange = SingleChildNode<string>("trivial-range")

class LimitsRange extends BaseNode<string> {
	get type() {
		return "limits-range"
	}

	get lastChild() {
		return 1
	}

	read(i: number): INode<string, any[]> {
		return i === 0 ? this.from : this.to
	}

	constructor(
		private readonly from: ICellNode<string>,
		private readonly to: ICellNode<string>
	) {
		super()
	}
}

class Range extends BaseNode<string> {
	static readonly type = "range"
	static is(x: INode<string>) {
		return x.type === Range.type
	}

	private child: INode<string>

	get type() {
		return "range"
	}

	get lastChild(): number {
		return 0
	}

	read(i: number): INode<string, any[]> {
		return this.child
	}

	index(multind: number[]): INode<string, any[]> {
		const [, ...subIndex] = multind
		return this.child.index(subIndex)
	}

	add(item: INode<string>) {
		this.child = item
	}
}

const CommaNode = TokenNode("comma")

const RangeBoundary = ContentNode("range-boundary")

const CommaNodeStream = SingletonStream(() => new CommaNode())

const RangeLimitStream = EndBracketStream(isCurr("}"))

const RangeBoundaryLimitStream = LimitStream((input: IOwnedStream<string>) =>
	isDecimal(input.curr)
)

const RangeBoundaryStream = CollectionStream(
	RangeBoundary,
	consumable(new SourceBuilder())
)

class RangeStream extends NodeStream<Range> {
	private finalRange: Range
	private firstItem: ICellNode<string>
	private lastItem: ICellNode<string>

	private tryTrivial() {
		this.firstItem = this.resource!.curr as ICellNode<string>
		this.resource!.next() // skipping first item
		return this.reviveChild()
	}

	private asTrivial() {
		this.finalRange.add(new TrivialRange(this.firstItem))
		this.resource!.next() // killing last child
		// ! VALIDATE THAT THE CHILD IS INDEED LAST!!!
	}

	private asInfinite() {
		this.finalRange.add(new InfiniteRange(this.firstItem))
	}

	private tryLimits() {
		this.resource!.next() // skipping second item
		return this.reviveChild()
	}

	private asLimits() {
		this.lastItem = this.resource!.curr
		this.finalRange.add(new LimitsRange(this.firstItem, this.lastItem))
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

	isCurrEnd(): boolean {
		return true
	}

	next() {
		this.endStream()
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

abstract class ByGreedinessRange extends BaseNode<string> {
	get lastChild(): number {
		return 1
	}

	read(i: number): INode<string, any[]> {
		return i === 0 ? this.child : this.range
	}

	constructor(
		private readonly child: INode<string>,
		private readonly range: Range
	) {
		super()
	}
}

class NonGreedyRange extends ByGreedinessRange {
	get type() {
		return "non-greedy-range"
	}
}

class GreedyRange extends ByGreedinessRange {
	get type() {
		return "greedy-range"
	}
}

function handleRangeAfterItem(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	const range = next(input) as Range // Range({...})
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return [SingletonStream(() => new NonGreedyRange(child, range))()]
	}
	return [SingletonStream(() => new GreedyRange(child, range))()]
}

export const maybeRange: array.Pairs<ITypeCheckable, IStreamChooser> = [
	[Range, handleRangeAfterItem]
]

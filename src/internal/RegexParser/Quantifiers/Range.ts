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
	ensureChildUnrevivable,
	expect,
	expectKind
} from "../../../objects/Error.js"
import { LimitStream, SingleNodeStream } from "../../../objects/Stream.js"
import { isDecimal } from "../../../samples/alphabet.js"
import {
	CachedTokenStream,
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../../samples/Stream.js"
import { consumable } from "../../../utils/Stream.js"
import {
	InfiniteRange,
	LimitsRange,
	Range,
	RangeBoundary,
	Temp,
	TrivialRange
} from "../Nodes.js"
import { handleQuantifier } from "./Greedy.js"

const CommaStream = CachedTokenStream(Temp.Comma)

const RangeLimitStream = EndBracketStream(isCurr("}"))

const RangeBoundaryLimitStream = LimitStream((input: IOwnedStream<string>) =>
	isDecimal(input.curr)
)

const RangeBoundaryStream = CollectionStream(
	RangeBoundary,
	consumable(new SourceBuilder())
)

const expectRangeBoundary = expectKind(RangeBoundary)
const expectCommaNode = expectKind(Temp.Comma)
const expectComma = expect(",")

class RangeStream extends SingleNodeStream<IPoolNode<[INode]>> {
	private finalRange: IPoolNode<[INode]>
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
	return [CommaStream()]
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

export const maybeRange: array.Pairs<ITypeCheckable, IStreamChooser> = [
	[Range, handleQuantifier]
]

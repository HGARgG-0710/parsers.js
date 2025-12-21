import { array } from "@hgargg-0710/one"
import type {
	ICellNode,
	INode,
	IOwnedStream,
	IPeekableStream,
	IPoolNode,
	IStreamChooser,
	ITypeCheckable
} from "../../../interfaces.js"
import { SourceBuilder } from "../../../objects.js"
import {
	ensureChildUnrevivable,
	ensureCurrDecimal,
	expectKind,
	skip
} from "../../../objects/Error.js"
import {
	LimitStream,
	SingleNodeStream,
	SingletonStream,
	ValidatorStream
} from "../../../objects/Stream.js"
import { isDecimal } from "../../../samples/alphabet.js"
import {
	CachedTokenStream,
	EndBracketStream,
	isCurr,
	isNotNext,
	PastEndStream
} from "../../../samples/Stream.js"
import { consumableIterable } from "../../../utils/Stream.js"
import {
	InfiniteRange,
	LimitsRange,
	Range,
	RangeBoundary,
	Temp,
	TrivialRange
} from "../Nodes.js"
import { handleRangeQuantifier } from "./Common.js"

const skipOpbrace = skip("{")
const expectRangeBoundary = expectKind(RangeBoundary)
const expectCommaNode = expectKind(Temp.Comma)
const skipComma = skip(",")

const CommaStream = CachedTokenStream(Temp.Comma)

const RangeLimitStream = EndBracketStream(
	LimitStream.Limits.builder<string>()
		.setFrom((input) => {
			skipOpbrace(input) // {
			return 0
		})
		.setIsEmpty(isCurr("}"))
		.setLongAs(isNotNext("}"))
		.build()
)

const RangeBoundaryLimitStream = PastEndStream(
	LimitStream.Limits.builder<string>()
		.setLongAs((input: IPeekableStream<string>) => isDecimal(input.peek(1)))
		.build()
)

const boundaryMaker = consumableIterable(new SourceBuilder())

const RangeBoundaryValidatorStream = ValidatorStream(ensureCurrDecimal)
const RangeBoundaryStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) =>
		new RangeBoundary(Number(boundaryMaker(input).get()))
)

class RangeStream extends SingleNodeStream<IPoolNode<[INode]>> {
	private finalRange: IPoolNode<[INode]>
	private first: ICellNode<number>
	private last: ICellNode<number>

	private tryTrivial() {
		expectRangeBoundary(this.resource!)
		this.first = this.resource!.curr as ICellNode<number>
		this.resource!.next() // skipping first item
		return !this.reviveChild() // does this die after 1st?
	}

	private asTrivial() {
		this.finalRange = new Range(new TrivialRange(this.first))
		this.resource!.next() // killing last (1st here) child
	}

	private asInfinite() {
		this.finalRange = new Range(new InfiniteRange(this.first))
	}

	private tryLimits() {
		expectCommaNode(this.resource!)
		this.resource!.next() // skipping 2nd item (Comma)
		return this.reviveChild() // is this alive for the 3rd?
	}

	private asLimits() {
		expectRangeBoundary(this.resource!)
		this.last = this.resource!.curr
		this.finalRange = new Range(new LimitsRange(this.first, this.last))
		ensureChildUnrevivable(this) // we're definitely finished, no weird leftovers
	}

	baseInit(): void {
		this.curr = this.finalRange
		if (this.tryTrivial()) this.asTrivial()
		else if (this.tryLimits()) this.asLimits()
		else this.asInfinite()
	}
}

function HandleComma(input: IOwnedStream<string>) {
	skipComma(input) // ,
	return [CommaStream()]
}

function HandleDecimal() {
	return [
		RangeBoundaryStream(),
		RangeBoundaryValidatorStream(),
		RangeBoundaryLimitStream()
	]
}

function HandleDecimalOrComma(input: IOwnedStream<string>) {
	return isDecimal(input.curr) ? HandleDecimal() : HandleComma(input)
}

export function HandleRange() {
	return [new RangeStream(), HandleDecimalOrComma, RangeLimitStream()]
}

export const maybeRange: array.Pairs<ITypeCheckable, IStreamChooser> = [
	[Range, handleRangeQuantifier]
]

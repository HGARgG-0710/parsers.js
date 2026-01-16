import { array } from "@hgargg-0710/one"
import type {
	IBasicStream,
	ICellNode,
	INode,
	IOwnedStream,
	IPeekableStream,
	IPoolNode,
	IStatelessStreamChooser,
	ITypeCheckable
} from "../../../../interfaces.js"
import {
	ensureChildUnrevivable,
	ensureCurrDecimal,
	expectKind,
	skip
} from "../../../../objects/Error.js"
import {
	LimitStream,
	SingleNodeStream,
	SingletonStream,
	ValidatorStream
} from "../../../../objects/Stream.js"
import { isDecimal } from "../../../../samples/alphabet.js"
import {
	CachedTokenStream,
	EndBracketStream,
	PastEndStream
} from "../../../../samples/Stream.js"
import { getStringConsumable } from "../../../../utils/Stream.js"
import {
	InfiniteRange,
	LimitsRange,
	Range,
	RangeBoundary,
	Temp,
	TrivialRange
} from "../Nodes.js"
import {
	isCurrClbrace,
	isNotNextClbrace,
	skipOpbrace
} from "../Utils/limits.js"
import { handleRangeQuantifier } from "./Common.js"

const expectRangeBoundary = expectKind(RangeBoundary)
const expectCommaNode = expectKind(Temp.Comma)
const skipComma = skip(",")

const CommaStream = CachedTokenStream(Temp.Comma)

const RangeLimitStream = EndBracketStream(
	new LimitStream.Limits.Builder<string>()
		.setFrom((input) => {
			skipOpbrace(input) // {
			return 0
		})
		.setIsEmpty(isCurrClbrace)
		.setLongAs(isNotNextClbrace)
)

const RangeBoundaryLimitStream = PastEndStream(
	new LimitStream.Limits.Builder<string>().setLongAs(
		(input: IPeekableStream<string>) => isDecimal(input.peek(1))
	)
)

const boundaryMaker = getStringConsumable()

const RangeBoundaryValidatorStream = ValidatorStream(ensureCurrDecimal)
const RangeBoundaryStream = SingletonStream(
	(input: IBasicStream<string>) =>
		new RangeBoundary(Number(boundaryMaker(input).get()))
)

class RangeFactory {
	getTrivial(first: ICellNode<number>) {
		return new Range(new TrivialRange(first))
	}

	getInfinite(first: ICellNode<number>) {
		return new Range(new InfiniteRange(first))
	}

	getLimits(first: ICellNode<number>, last: ICellNode<number>) {
		return new Range(new LimitsRange(first, last))
	}
}

class RangeStream extends SingleNodeStream<IPoolNode<[INode]>> {
	private readonly ranges = new RangeFactory()
	private first: ICellNode<number>

	private setFirst(item: ICellNode<number>) {
		this.first = item
	}

	private tryTrivial() {
		expectRangeBoundary(this.resource!)
		this.setFirst(this.resource!.curr as ICellNode<number>)
		this.resource!.next() // skipping first item
		return !this.reviveChild() // does this die after 1st?
	}

	private asTrivial(first: ICellNode<number>) {
		this.resource!.next() // killing last (1st here) child
		return this.ranges.getTrivial(first)
	}

	private asInfinite(first: ICellNode<number>) {
		return this.ranges.getInfinite(first)
	}

	private tryLimits() {
		expectCommaNode(this.resource!)
		this.resource!.next() // skipping 2nd item (Comma)
		return this.reviveChild() // is this alive for the 3rd?
	}

	private asLimits(first: ICellNode<number>) {
		expectRangeBoundary(this.resource!)
		const last = this.resource!.curr
		ensureChildUnrevivable(this) // we're definitely finished, no weird leftovers
		return this.ranges.getLimits(first, last)
	}

	private getRange() {
		return this.tryTrivial()
			? this.asTrivial(this.first)
			: this.tryLimits()
			? this.asLimits(this.first)
			: this.asInfinite(this.first)
	}

	override baseInit(): void {
		this.curr = this.getRange()
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

export const maybeRange: array.Pairs<ITypeCheckable, IStatelessStreamChooser> =
	[[Range, handleRangeQuantifier]]

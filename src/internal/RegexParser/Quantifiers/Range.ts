import type { array } from "@hgargg-0710/one"
import { SourceBuilder } from "../../../classes.js"
import {
	BaseNode,
	ContentNode,
	SingleChildNode
} from "../../../classes/Node.js"
import {
	DyssyncOwningStream,
	FilterStream,
	LimitStream,
	SingletonStream
} from "../../../classes/Stream.js"
import type {
	INode,
	INodeType,
	IOwnedStream,
	IStreamChooser
} from "../../../interfaces.js"
import { isDecimal } from "../../../utils.js"
import { consume, next } from "../../../utils/Stream.js"
import { QMark } from "./QMark.js"

// * Supposed to have 1 position, with an optional SECOND!
class Range extends BaseNode<string> {
	get type() {
		return "range"
	}
}

// TODO: this is supposed to OUTLIVE underlying `Numeric` stream (that provides the '{n, k}' limits)
// * Based upon `Range`; ONLY ONE RETURN VALUE - a new `Range`...
class RangeStream extends DyssyncOwningStream.generic!<Range>() {}

const RangeLimitStream = LimitStream(
	(input: IOwnedStream<string>) => input.curr === "}"
)

const CommaFilterStream = FilterStream((input) => input.curr !== ",")

const RangeBoundaryLimitStream = LimitStream(
	(input: IOwnedStream<string>) => !isDecimal(input.curr)
)

const boundaryBuilder = new SourceBuilder()
const RangeBoundary = ContentNode("range-boundary")
const RangeBoundaryStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) => {
		boundaryBuilder.clear()
		return new RangeBoundary(consume(input, boundaryBuilder).get())
	}
)

function ProcessRangeBoundaries() {
	return [RangeBoundaryStream(), RangeBoundaryLimitStream()]
}

export function HandleRange(input: IOwnedStream<string>) {
	input.next() // {
	return [
		new RangeStream(),
		ProcessRangeBoundaries,
		CommaFilterStream(),
		RangeLimitStream()
	]
}

const NonGreedyRange = SingleChildNode("non-greedy-range")
const GreedyRange = SingleChildNode("greedy-range")

function handleRangeAfterItem(input: IOwnedStream<INode<string>>) {
	const child = next(input)
	input.next() // Plus(+)
	if (QMark.is(input.curr)) {
		input.next() // QMark(?)
		return SingletonStream(() => new NonGreedyRange(child))()
	}
	return SingletonStream(() => new GreedyRange(child))()
}

export const maybeRange: array.Pairs<INodeType<string>, IStreamChooser> = [
	[Range, handleRangeAfterItem]
]

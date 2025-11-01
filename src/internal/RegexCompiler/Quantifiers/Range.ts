import type { ICellNode, INode, IRegexBuilder } from "../../../interfaces.js"
import type { DepthStream } from "../../../objects/Stream.js"
import { mapTypes } from "../../../utils/Node.js"
import {
	InfiniteRange,
	LimitsRange,
	TrivialRange
} from "../../RegexParser/Nodes.js"
import { type IRegexCompilerHandler } from "../Compiler.js"
import { RegexTypeHandler } from "../RegexTypeHandler.js"
import { compilerBuilderErrHandler } from "../Errors.js"

function readRangeBoundary(range: INode, isStart: boolean) {
	return (range.read(1 - +isStart) as ICellNode<number>).value
}

function readStartBoundary(range: INode) {
	return readRangeBoundary(range, true)
}

function readEndBoundary(range: INode) {
	return readRangeBoundary(range, false)
}

function handleTrivialRange(input: DepthStream<INode>) {
	const times = readStartBoundary(input.curr)
	return [times, times]
}

function handleInfiniteRange(input: DepthStream<INode>) {
	const from = readStartBoundary(input.curr)
	return [from, Infinity]
}

function handleLimitsRange(input: DepthStream<INode>) {
	const range = input.curr
	return [readStartBoundary(range), readEndBoundary(range)]
}

// ! Replace the `compilerBuilderErrHandler` with a more appropriate one...
const rangeKindsHandler = RegexTypeHandler(
	mapTypes([
		[TrivialRange, handleTrivialRange],
		[InfiniteRange, handleInfiniteRange],
		[LimitsRange, handleLimitsRange]
	]),
	compilerBuilderErrHandler
)

// TODO: REFACTOR THIS [the function is way too long...]
export function compileRange(regexBuilder: IRegexBuilder) {
	return function (
		input: DepthStream<INode>,
		handler: IRegexCompilerHandler
	) {
		input.next() // RangeQuantifier
		const toMatch = handler(input)
		input.next()
		input.next() // Range

		const [from, to] = rangeKindsHandler(input)
		const more = to - from

		const catBuilder = regexBuilder.catenation()
		catBuilder.addItem(regexBuilder.repeat(toMatch, from))

		if (more > 0)
			if (more === Infinity)
				catBuilder.addItem(regexBuilder.noneOrMore(toMatch))
			else
				for (let i = 0; i < more; ++i)
					catBuilder.addItem(regexBuilder.optional(toMatch))

		return catBuilder.finish()
	}
}

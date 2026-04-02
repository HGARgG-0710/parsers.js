import assert from "node:assert"
import type {
	ICellNode,
	INode,
	IRegexCompilerHandler,
	IRegexFactory,
	IRegexPartBuilder
} from "../../../../interfaces.js"
import type { Regex } from "../../../../objects.js"
import type { TreeStream } from "../../../../objects/Stream.js"
import { InfiniteRange, LimitsRange, TrivialRange } from "../../Parser/Nodes.js"
import { rangeKindsErrHandler } from "../Errors.js"
import { RegexTypeHandler } from "../RegexTypeHandler.js"

import { array } from "@hgargg-0710/one"
const { numbers } = array

function readRangeBoundary(range: INode, isStart: boolean) {
	return (range.read(1 - +isStart) as ICellNode<number>).value
}

function readStartBoundary(range: INode) {
	return readRangeBoundary(range, true)
}

function readEndBoundary(range: INode) {
	return readRangeBoundary(range, false)
}

function handleTrivialRange(input: TreeStream<INode>) {
	const times = readStartBoundary(input.curr)
	return [times, times]
}

function handleInfiniteRange(input: TreeStream<INode>) {
	const from = readStartBoundary(input.curr)
	return [from, Infinity]
}

function handleLimitsRange(input: TreeStream<INode>) {
	const range = input.curr
	return [readStartBoundary(range), readEndBoundary(range)]
}

const rangeKindsHandler = RegexTypeHandler<number[]>(
	[
		[TrivialRange, handleTrivialRange],
		[InfiniteRange, handleInfiniteRange],
		[LimitsRange, handleLimitsRange]
	],
	rangeKindsErrHandler
)

function toCatenationBuilder(
	regexBuilder: IRegexFactory,
	toMatch: Regex.Raw,
	fromTimes: number
) {
	return regexBuilder
		.catenation()
		.addItem(regexBuilder.repeat(toMatch, fromTimes))
}

function toRangeParts(input: TreeStream<INode>) {
	const [from, to] = rangeKindsHandler(input)
	return [to, to - from]
}

function repeatNoneOrMore(toMatch: Regex.Raw, regexBuilder: IRegexFactory) {
	return [regexBuilder.noneOrMore(toMatch)]
}

function repeatOptional(toRepeat: number): RepetitionMethod {
	return (toMatch: Regex.Raw, regexBuilder: IRegexFactory) =>
		numbers(toRepeat).map(() => regexBuilder.optional(toMatch))
}

type RepetitionMethod = (
	toMatch: Regex.Raw,
	regexBuilder: IRegexFactory
) => Regex.Raw[]

function getRepetitionMethod(toRepeat: number): RepetitionMethod {
	assert(toRepeat > 0)
	return toRepeat === Infinity ? repeatNoneOrMore : repeatOptional(toRepeat)
}

class RegexPartIncluder {
	include(parts: Regex.Raw[]) {
		for (const part of parts) this.partBuilder.addItem(part)
		return this
	}

	finish() {
		return this.partBuilder.finish()
	}

	constructor(private readonly partBuilder: IRegexPartBuilder) {}
}

export function compileRange(regexBuilder: IRegexFactory) {
	return function (input: TreeStream<INode>, handler: IRegexCompilerHandler) {
		input.next() // RangeQuantifier
		const toMatch = handler(input)
		input.next()
		input.next() // Range

		const [from, toRepeat] = toRangeParts(input)
		const catBuilder = toCatenationBuilder(regexBuilder, toMatch, from)
		const repMethod = getRepetitionMethod(toRepeat)
		return new RegexPartIncluder(catBuilder)
			.include(repMethod(toMatch, regexBuilder))
			.finish()
	}
}

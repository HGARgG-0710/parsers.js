import type {
	DirectionalPosition,
	Position,
	PredicatePosition
} from "../../../../../dist/src/Stream/PositionalStream/Position/interfaces.js"

import type { RewindableStream } from "../../../../../dist/src/Stream/RewindableStream/interfaces.js"

import { typeof as type } from "@hgargg-0710/one"
const { isNumber, isFunction } = type

import {
	endPredicate,
	isBackward,
	isDualPosition,
	isPosition,
	isPositionObject,
	iterationChoice,
	pickDirection,
	positionConvert,
	positionCopy,
	positionEqual,
	positionNegate,
	positionSame,
	positionStopPoint,
	predicateChoice,
	preserveDirection
} from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"
import { equals, utilTest } from "lib/lib.js"
import type {
	ChangeType,
	ReversibleStream
} from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"
import type { StreamPredicate } from "../../../../../dist/src/Parser/ParserMap/interfaces.js"
import type { BoundNameType } from "../../../../../dist/src/Stream/StreamClass/interfaces.js"

const positionTrivialEquality = (x: DirectionalPosition, y: DirectionalPosition) =>
	(isNumber(x) && isNumber(y)) ||
	(isFunction(x) && isFunction(y) && isBackward(x) === isBackward(y))

const [
	baseIsPositionObjectTest,
	baseIsPositionTest,
	baseIsDualPositionTest,
	basePositionConvertTest,
	basePositionNegateTest,
	basePositionSameTest,
	basePositionEqualTest,
	basePositionCopyTest,
	basePredicateChoiceTest,
	baseIsBackwardTest,
	basePickDirectionTest,
	baseEndPredicateTest,
	baseIterationChoiceTest,
	basePreserveDirectionTest,
	basePositionStopPointTest
] = [
	[isPositionObject, "isPositionObject"],
	[isPosition, "isPosition"],
	[isDualPosition, "isDualPosition"],
	[positionConvert, "positionConvert"],
	[positionNegate, "positionNegate"],
	[positionSame, "positionSame"],
	[positionEqual, "positionEqual"],
	[positionCopy, "positionCopy"],
	[predicateChoice, "predicateChoice"],
	[isBackward, "isBackward"],
	[pickDirection, "pickDirection"],
	[endPredicate, "endPredicate"],
	[iterationChoice, "iterationChoice"],
	[preserveDirection, "preserveDirection"],
	[positionStopPoint, "positionStopPoint"]
].map(([method, name]) => utilTest(method as Function, name as string))

export const isPositionObjectTest = baseIsPositionObjectTest(equals)
export const IsPositionTest = baseIsPositionTest(equals)
export const isDualPositionTest = baseIsDualPositionTest(equals)

export const positionConvertTest = basePositionConvertTest(positionTrivialEquality)

const preserveDirectionTestCompare = (x: DirectionalPosition, y: DirectionalPosition) =>
	isFunction(x) ? isFunction(y) && x.direction === y.direction : equals(x, y)
export const positionNegateTest = basePositionNegateTest(preserveDirectionTestCompare)

export const positionsSameTest = basePositionSameTest(equals)
export const positionsEqualTest = basePositionEqualTest(equals)

export const positionCopyTest = basePositionCopyTest((x: Position, input: Position) =>
	isPositionObject(x) ? isPositionObject(input) && !equals(x, input) : equals(x, input)
)

export const predicateChoiceTest = basePredicateChoiceTest(
	(x: Position, input: Position) =>
		isFunction(x) && (!isNumber(input) || x.direction === input >= 0)
)

export const isBackwardTest = baseIsBackwardTest(equals)
export const pickDirectionTest = basePickDirectionTest(equals)

const endPredicateTestCompare = (
	output: StreamPredicate,
	streamDirectionPredicate: [
		ReversibleStream & RewindableStream,
		ChangeType,
		PredicatePosition,
		BoundNameType
	]
) => {
	const [stream, change, initPred, stopPoint] = streamDirectionPredicate

	let i = 0
	stream.rewind()
	while (!stream[stopPoint] && initPred(stream, i)) {
		change(stream)
		++i
	}
	const expectedCurr = stream.curr

	stream.rewind()
	while (output(stream, i)) {
		change(stream)
		++i
	}

	return equals(expectedCurr, stream.curr)
}

export const endPredicateTest = baseEndPredicateTest(endPredicateTestCompare)

export const iterationChoiceTest = baseIterationChoiceTest(
	(
		output: [ChangeType, StreamPredicate],
		input: [ReversibleStream & RewindableStream, DirectionalPosition, BoundNameType]
	) => {
		const [endPredicate, change] = output
		const [stream, directional, stopPoint] = input
		return endPredicateTestCompare(endPredicate, [
			stream,
			change,
			predicateChoice(directional),
			stopPoint
		])
	}
)

export const preserveDirectionTest = basePreserveDirectionTest(
	preserveDirectionTestCompare
)
export const positionStopPointTest = basePositionStopPointTest(equals)

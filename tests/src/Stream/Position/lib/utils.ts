import type { StreamPredicate } from "../../../../../dist/src/Parser/ParserMap/interfaces.js"
import type { BoundNameType } from "../../../../../dist/src/Stream/StreamClass/interfaces.js"
import type { Rewindable } from "../../../../../dist/src/Stream/StreamClass/Rewindable/interfaces.js"

import type {
	DirectionalPosition,
	PredicatePosition
} from "../../../../../dist/src/Stream/PositionalStream/Position/interfaces.js"

import type {
	ChangeType,
	ReversibleStream
} from "../../../../../dist/src/Stream/ReversibleStream/interfaces.js"

import {
	isBackward,
	isPosition,
	isPositionObject,
	pickDirection,
	positionConvert,
	positionEqual,
	positionNegate,
	positionSame,
	positionStopPoint,
	preserveDirection
} from "../../../../../dist/src/Stream/PositionalStream/Position/utils.js"

import { utilTest } from "lib/lib.js"

import { typeof as type, boolean } from "@hgargg-0710/one"
const { isNumber, isFunction } = type
const { equals } = boolean

const positionTrivialEquality = (x: DirectionalPosition, y: DirectionalPosition) =>
	(isNumber(x) && isNumber(y)) ||
	(isFunction(x) && isFunction(y) && isBackward(x) === isBackward(y))

const [
	baseIsPositionObjectTest,
	baseIsPositionTest,
	basePositionConvertTest,
	basePositionNegateTest,
	basePositionSameTest,
	basePositionEqualTest,
	baseIsBackwardTest,
	basePickDirectionTest,
	basePreserveDirectionTest,
	basePositionStopPointTest
] = [
	[isPositionObject, "isPositionObject"],
	[isPosition, "isPosition"],
	[positionConvert, "positionConvert"],
	[positionNegate, "positionNegate"],
	[positionSame, "positionSame"],
	[positionEqual, "positionEqual"],
	[isBackward, "isBackward"],
	[pickDirection, "pickDirection"],
	[preserveDirection, "preserveDirection"],
	[positionStopPoint, "positionStopPoint"]
].map(([method, name]) => utilTest(method as Function, name as string))

export const isPositionObjectTest = baseIsPositionObjectTest(equals)
export const isPositionTest = baseIsPositionTest(equals)

export const positionConvertTest = basePositionConvertTest(positionTrivialEquality)

const preserveDirectionTestCompare = (x: DirectionalPosition, y: DirectionalPosition) =>
	isFunction(x) ? isFunction(y) && x.direction === y.direction : equals(x, y)
export const positionNegateTest = basePositionNegateTest(preserveDirectionTestCompare)

export const positionsSameTest = basePositionSameTest(equals)
export const positionsEqualTest = basePositionEqualTest(equals)

export const isBackwardTest = baseIsBackwardTest(equals)
export const pickDirectionTest = basePickDirectionTest(equals)

const endPredicateTestCompare = (
	output: StreamPredicate,
	streamDirectionPredicate: [
		ReversibleStream & Rewindable,
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

export const preserveDirectionTest = basePreserveDirectionTest(
	preserveDirectionTestCompare
)
export const positionStopPointTest = basePositionStopPointTest(equals)

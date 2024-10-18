import type { DirectionalPosition } from "../../../../dist/src/Position/interfaces.js"

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
} from "../../../../dist/src/Position/utils.js"

import { ambigiousUtilTest } from "lib/lib.js"

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
].map(([method, name]) => ambigiousUtilTest(method as Function, name as string))

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

export const preserveDirectionTest = basePreserveDirectionTest(
	preserveDirectionTestCompare
)
export const positionStopPointTest = basePositionStopPointTest(equals)

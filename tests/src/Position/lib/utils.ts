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
	preserveDirection,
	directionCompare
} from "../../../../dist/src/Position/utils.js"

import { comparisonUtilTest, utilTest } from "lib/lib.js"

import { type, boolean } from "@hgargg-0710/one"
const { isNumber, isFunction } = type
const { equals } = boolean

export const [
	isPositionObjectTest,
	isPositionTest,
	positionSameTest,
	positionEqualTest,
	isBackwardTest,
	pickDirectionTest,
	positionStopPointTest,
	directionCompareTest
] = [
	[isPositionObject, "isPositionObject"],
	[isPosition, "isPosition"],
	[positionSame, "positionSame"],
	[positionEqual, "positionEqual"],
	[isBackward, "isBackward"],
	[pickDirection, "pickDirection"],
	[positionStopPoint, "positionStopPoint"],
	[directionCompare, "directionCompare"]
].map(([util, name]) => utilTest(util as Function, name as string))

const preserveDirectionTestCompare = (x: DirectionalPosition, y: DirectionalPosition) =>
	isFunction(x) ? isFunction(y) && x.direction === y.direction : equals(x, y)
const directionUtilTest = comparisonUtilTest(preserveDirectionTestCompare)

export const preserveDirectionTest = directionUtilTest(
	preserveDirection,
	"preserveDirection"
)

export const positionNegateTest = directionUtilTest(positionNegate, "positionNegate")

const positionTrivialEquality = (x: DirectionalPosition, y: DirectionalPosition) =>
	(isNumber(x) && isNumber(y)) ||
	(isFunction(x) && isFunction(y) && isBackward(x) === isBackward(y))

export const positionConvertTest = comparisonUtilTest(positionTrivialEquality)(
	positionConvert,
	"positionConvert"
)

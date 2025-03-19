import type { IDirectionalPosition } from "../../../../dist/src/Position/interfaces.js"

import {
	direction,
	isPosition,
	isPositionObject,
	pickDirection,
	positionConvert,
	positionEqual,
	positionNegate,
	positionSame,
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
	[direction, "direction"],
	[pickDirection, "pickDirection"],
	[directionCompare, "directionCompare"]
].map(([util, name]) => utilTest(util as Function, name as string))

const preserveDirectionTestCompare = (
	x: IDirectionalPosition,
	y: IDirectionalPosition
) =>
	isFunction(x) ? isFunction(y) && x.direction === y.direction : equals(x, y)

const directionUtilTest = comparisonUtilTest(preserveDirectionTestCompare)

export const preserveDirectionTest = directionUtilTest(
	preserveDirection,
	"preserveDirection"
)

export const positionNegateTest = directionUtilTest(
	positionNegate,
	"positionNegate"
)

const positionTrivialEquality = (
	x: IDirectionalPosition,
	y: IDirectionalPosition
) =>
	(isNumber(x) && isNumber(y)) ||
	(isFunction(x) && isFunction(y) && direction(x) === direction(y))

export const positionConvertTest = comparisonUtilTest(positionTrivialEquality)(
	positionConvert,
	"positionConvert"
)

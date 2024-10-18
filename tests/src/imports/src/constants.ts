import { importTest, objectImports } from "imports/lib/imports.js"
import * as constants from "../../../../dist/src/constants.js"

import { typeof as type } from "@hgargg-0710/one"
const { isNumber, isBoolean, isNull, isFunction } = type

importTest(objectImports("StreamClass", "LimitedStream", "PatternValidator"))(constants)

const { StreamClass, LimitedStream, PatternValidator } = constants

// * StreamClass
importTest([
	["PreCurrInit", isNumber],
	["PostCurrInit", isBoolean],
	["PostStart", isBoolean],
	["DefaultRealCurr", isNull]
])(StreamClass)

// * LimitedStream
importTest([["NoMovementPredicate", isFunction]])(LimitedStream)

// * PatternValidator
importTest([
	["NoFullCoverage", isNull],
	["FullCoverage", isBoolean],
	["ValidationError", isFunction]
])(PatternValidator)

import {
	LimitedStream,
	PatternValidator,
	StreamClass
} from "../../../dist/src/constants.js"
import { arrayConstTest, constTest } from "./lib/constants.js"
import { namespace } from "lib/lib.js"

import { boolean, typeof as type } from "@hgargg-0710/one"
const { T } = boolean
const { isNumber } = type

// * StreamClass
const { PreCurrInit, PostCurrInit, PostStart, DefaultRealCurr } = StreamClass
namespace("StreamClass", () => {
	constTest("PreCurrInit", PreCurrInit, 1)
	constTest("PostCurrInit", PostCurrInit, true)
	constTest("PostStart", PostStart, false)
	constTest("DefaultRealCurr", DefaultRealCurr, null)
})

// * LimitedStream
const { NoMovementPredicate } = LimitedStream
namespace("LimitedStream", () => {
	constTest("NoMovementPredicate", NoMovementPredicate, T)
})

// * PatternValidator
const { NoFullCoverage, FullCoverage, ValidationError } = PatternValidator
namespace("PatternValidator", () => {
	constTest("NoFullCoverage", NoFullCoverage, null)
	constTest("FullCoverage", FullCoverage, true)
	for (let i = 0; i < 20; ++i)
		arrayConstTest("ValidationError", ValidationError(i), 2, [
			[0, (x) => x === false],
			[1, isNumber]
		])
})

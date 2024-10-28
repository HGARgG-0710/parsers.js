import {
	LimitedStream,
	PatternValidator,
	StreamClass,
	ValidatablePattern
} from "../../../dist/src/constants.js"
import { arrayConstTest, constTest } from "./lib/constants.js"
import { namespace, repeat } from "lib/lib.js"

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
	repeat(20, (i) =>
		arrayConstTest("ValidationError", ValidationError(i), 2, [
			[0, (x) => x === false],
			[1, isNumber]
		])
	)
})

// * ValidatablePattern
const { ValidationPassed, ValidationFailed, FaultyElement, ValidMatch, InvalidMatch } =
	ValidatablePattern
namespace("ValidatablePattern", () => {
	const letterCheck = (letter: string) => (x: string) => x === letter && x.length === 1
	const testLetters = ["S", "P"]
	const falseCheck = (x: boolean) => x === false

	constTest("ValidMatch", ValidMatch, true)
	constTest("InvalidMatch", InvalidMatch, false)

	for (const letter of testLetters)
		arrayConstTest("ValidationPassed", ValidationPassed([letter]), 2, [
			[0, (x) => x === true],
			[1, letterCheck(letter)]
		])

	for (const letter of testLetters) {
		arrayConstTest("ValidationFailed", ValidationFailed([letter]), 2, [
			[0, falseCheck],
			[1, letterCheck(letter)]
		])

		arrayConstTest("FaultyElement", FaultyElement(letter), 2, [
			[0, falseCheck],
			[1, (x) => x === letter]
		])
	}
})

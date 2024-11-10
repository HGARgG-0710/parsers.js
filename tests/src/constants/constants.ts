import { validation, Stream, regex } from "../../../dist/src/constants.js"
import { arrayConstTest, constTest } from "./lib/constants.js"
import { namespace, repeat } from "lib/lib.js"

import { boolean, typeof as type } from "@hgargg-0710/one"
const { T } = boolean
const { isNumber } = type

// * Stream

const { StreamClass, LimitedStream, StreamParser } = Stream
namespace("Stream", () => {
	// * Stream->StreamClass

	const { PreCurrInit, PostCurrInit, PostStart, DefaultRealCurr } = StreamClass
	namespace("StreamClass", () => {
		constTest("PreCurrInit", PreCurrInit, 1)
		constTest("PostCurrInit", PostCurrInit, true)
		constTest("PostStart", PostStart, false)
		constTest("DefaultRealCurr", DefaultRealCurr, null)
	})

	// * Stream->LimitedStream

	const { NoMovementPredicate } = LimitedStream
	namespace("LimitedStream", () => {
		constTest("NoMovementPredicate", NoMovementPredicate, T)
	})

	// * Stream->StreamParser

	const { SkippedItem } = StreamParser
	namespace("StreamParser", () => {
		constTest("SkippedItem", SkippedItem, undefined)
	})
})

// * validation
const { PatternValidator, ValidatablePattern, ValidationSuccess } = validation
namespace("validation", () => {
	constTest("ValidationSuccess", ValidationSuccess, true)

	// * validation->PatternValidator
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

	// * validation->ValidatablePattern
	const {
		ValidationPassed,
		ValidationFailed,
		FaultyElement,
		ValidMatch,
		InvalidMatch
	} = ValidatablePattern

	namespace("ValidatablePattern", () => {
		const letterCheck = (letter: string) => (x: string) =>
			x === letter && x.length === 1
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
})

// * regex
const {
	IndefiniteOccurrences,
	GlobalSearchFlag,
	UnicodeFlag,
	HasIndiciesFlag,
	CaseInsensitiveFlag,
	MultilineFlag,
	UnicodeSetsFlag,
	DotAllFlag,
	StickyFlag
} = regex

namespace("regex", () => {
	constTest("IndefiniteOccurrences", IndefiniteOccurrences, "")
	constTest("GlobalSearchFlag", GlobalSearchFlag, "g")
	constTest("UnicodeFlag", UnicodeFlag, "u")
	constTest("HasIndiciesFlag", HasIndiciesFlag, "d")
	constTest("CaseInsensitiveFlag", CaseInsensitiveFlag, "i")
	constTest("MultilineFlag", MultilineFlag, "m")
	constTest("UnicodeSetsFlag", UnicodeSetsFlag, "v")
	constTest("DotAllFlag", DotAllFlag, "s")
	constTest("StickyFlag", StickyFlag, "y")
})

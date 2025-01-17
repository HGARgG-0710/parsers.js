import { type } from "@hgargg-0710/one"
const { isString, isNumber } = type

import { validation } from "../../../dist/src/constants.js"

const { FaultyElement } = validation.ValidatablePattern

import {
	analyzeValidityTest,
	isFaultyElementTest,
	validateTokenizedTest
} from "./lib/utils.js"
import { tokenizeString } from "../../../dist/src/Tokenizable/utils.js"

// * isFaultyElement

const faultyStringTest = isFaultyElementTest(isString, "string")

faultyStringTest(false, "This is okay")
faultyStringTest(false, true)
faultyStringTest(true, [false, "This is not okay"])
faultyStringTest(true, FaultyElement("This is not okay either"))

const faultyNumberTest = isFaultyElementTest(isNumber, "number")

faultyNumberTest(false, 10)
faultyNumberTest(false, true)
faultyNumberTest(true, [false, 10])

// * analyzeValidity

analyzeValidityTest(
	[],
	[true, true, "This was left unvalidated", true, "another string"],
	isString
)

analyzeValidityTest(
	[
		[2, "Oh no! This doesn't!"],
		[5, "Sieg"],
		[6, "Loch"]
	],
	[
		true,
		"This works",
		[false, "Oh, no! This doesn't!"],
		true,
		"another string",
		[false, "Sieg"],
		[false, "Loch"],
		"Loss"
	],
	isString
)

analyzeValidityTest(
	[
		[0, 11],
		[5, 12]
	],
	[[false, 11], 90, 30, 20, true, [false, 12]],
	isNumber
)

// * validateTokenized

const validityPredicate = (x: string) =>
	x.length === 3 && ["l", "i"].includes(x[x.length - 1]) && 90 >= x.charCodeAt(0)

const validityRegex = /\w+/g

const [matched1, , tokenized1] = tokenizeString(
	"Rai; Bei; Mul; Kal",
	validityRegex,
	validityPredicate
)

const stringValidationTest = validateTokenizedTest(isString, "string")

stringValidationTest([true, "; ", true, ";", true, "; ", true], matched1, tokenized1)

const [matched2, , tokenized2] = tokenizeString(
	"Loci; Bei; dol; Rai; May; Dol; maay; don",
	validityRegex,
	validityPredicate
)

stringValidationTest(
	[
		false,
		";",
		true,
		"; ",
		false,
		"; ",
		true,
		"; ",
		false,
		"; ",
		true,
		"; ",
		false,
		"; ",
		false
	],
	matched2,
	tokenized2
)

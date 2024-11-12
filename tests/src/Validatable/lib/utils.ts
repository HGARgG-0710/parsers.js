import { arraysSame, comparisonUtilTest, utilTest } from "lib/lib.js"

import type {
	InvalidEntries,
	ValidationOutput
} from "../../../../dist/src/Validatable/interfaces.js"

import { typeof as type } from "@hgargg-0710/one"
const { isString } = type

import { utils } from "../../../../dist/main.js"

const { isFaultyElement, analyzeValidity, validateTokenized, validateString } =
	utils.Validatable

const validateTestBase = <Type = any>(isType: (x: any) => x is Type) =>
	comparisonUtilTest(
		(
			[resValid, resResult]: ValidationOutput<Type>,
			[expValid, expResult]: ValidationOutput<Type>
		) =>
			expValid === resValid &&
			resResult.every(isType) &&
			arraysSame(resResult, expResult)
	)

export const validateStringTest = validateTestBase(isString)(
	validateString,
	"validateString"
)

export const validateTokenizedTest = <Type = any>(isType: (x: any) => x is Type) =>
	validateTestBase(isType)(validateTokenized, "validateTokenized")

export const analyzeValidityTest = comparisonUtilTest(
	(entriesRes: InvalidEntries, entriesExp: InvalidEntries) =>
		entriesRes.length === entriesExp.length &&
		entriesRes.every(([valid], i) => entriesExp[i][0] === valid) &&
		entriesRes.every(([, elem], i) => entriesExp[i][1] === elem)
)(analyzeValidity, "analyzeValidity")

export const isFaultyElementTest = utilTest(isFaultyElement, "isFaultyElement")

import { arraysSame, comparisonUtilTest, utilTest } from "lib/lib.js"

import type {
	InvalidEntries,
	ValidationOutput
} from "../../../../dist/src/Validatable/interfaces.js"

import { utils } from "../../../../dist/main.js"

const { isFaultyElement, analyzeValidity, validateTokenized } = utils.Validatable

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

export const validateTokenizedTest = <Type = any>(
	isType: (x: any) => x is Type,
	typeName: string
) => validateTestBase(isType)(validateTokenized, `validateTokenized(${typeName})`)

export const analyzeValidityTest = comparisonUtilTest(
	(entriesRes: InvalidEntries, entriesExp: InvalidEntries) =>
		entriesRes.length === entriesExp.length &&
		entriesRes.every(([valid], i) => entriesExp[i][0] === valid) &&
		entriesRes.every(([, elem], i) => entriesExp[i][1] === elem)
)(analyzeValidity, "analyzeValidity")

export const isFaultyElementTest = <Type = any>(
	isType: (x: any) => x is Type,
	typeName: string
) => utilTest(isFaultyElement(isType), `isFaultyElement(${typeName})`)

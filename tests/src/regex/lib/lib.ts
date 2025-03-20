import { it } from "node:test"
import {
	comparisonUtilTest,
	doubleCurriedComparisonUtilTest,
	inputDescribe
} from "lib/lib.js"

import { regex_contents } from "../../../../dist/src/regex.js"

import { flags } from "../../../../dist/src/regex.js"

import { array } from "@hgargg-0710/one"

export function regex(utilName: string, regexps: any[], post: () => void) {
	it(`regex: [${inputDescribe(regexps)}] (from ${utilName})`, post)
}

const regexCompare = (regex: RegExp, contents: string) =>
	regex_contents(regex) === contents
const regexLiteralTest = comparisonUtilTest(regexCompare)

export function regexTest(utilName: string, regexUtil: Function) {
	return function (contents: string, ...regexp: any[]) {
		regex(utilName, regexp, () =>
			regexLiteralTest(regexUtil, utilName)(contents, ...regexp)
		)
	}
}

const regexFlagsLiteralTest = (util: Function) =>
	comparisonUtilTest((regex: RegExp, regex_flags: string[]) =>
		array.same(flags.flags(regex), regex_flags)
	)(util, "flags")

export function flagsRegexTest(utilName: string, regexUtil: Function) {
	return function (contents: string[], ...regexp: any[]) {
		regex(utilName, regexp, () =>
			regexFlagsLiteralTest(regexUtil)(contents, ...regexp)
		)
	}
}

export function regexCurriedTest(
	utilName: string,
	regexUtil: Function,
	arity: number
) {
	return function (contents: string, ...regexp: any[]) {
		return regex(utilName, regexp, () =>
			doubleCurriedComparisonUtilTest(regexCompare)(
				regexUtil,
				utilName,
				arity
			)(contents, ...regexp)
		)
	}
}

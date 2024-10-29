import { it } from "node:test"
import { arraysSame, comparisonUtilTest, inputDescribe } from "lib/lib.js"
import { regex_contents } from "../../../../dist/src/regex.js"

import flags from "../../../../dist/src/regex/flags.js"

export function regex(utilName: string, regexps: any[], post: () => void) {
	it(`regex: [${inputDescribe(regexps)}] (from ${utilName})`, post)
}

const regexLiteralTest = (util: Function) =>
	comparisonUtilTest(
		(regex: RegExp, contents: string) => regex_contents(regex) === contents
	)(util, "literal")

export function regexTest(utilName: string, regexUtil: Function) {
	return function (contents: string, ...regexp: any[]) {
		regex(utilName, regexp, () => regexLiteralTest(regexUtil)(contents, regexp))
	}
}

const regexFlagsLiteralTest = (util: Function) =>
	comparisonUtilTest((regex: RegExp, regex_flags: string[]) =>
		arraysSame(flags(regex), regex_flags)
	)(util, "flags")

export function flagsRegexTest(utilName: string, regexUtil: Function) {
	return function (contents: string[], ...regexp: any[]) {
		regex(utilName, regexp, () => regexFlagsLiteralTest(regexUtil)(contents, regexp))
	}
}

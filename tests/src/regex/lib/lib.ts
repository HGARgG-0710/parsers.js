import { comparisonUtilTest, inputDescribe } from "lib/lib.js"
import { it } from "node:test"
import { regex_contents } from "../../../../dist/src/regex.js"

export function regex(utilName: string, regexp: any[], post: () => void) {
	it(`regex: [${inputDescribe(regexp)}] (from ${utilName})`, post)
}

const regexLiteralTest = (util: Function) =>
	comparisonUtilTest(
		(regex: RegExp, contents: string) => regex_contents(regex) === contents
	)(util, "literal")

export function elementaryRegexTest(utilName: string, regexUtil: Function) {
	return function (regexp: RegExp, contents: string) {
		regex(utilName, [regexp], () => regexLiteralTest(regexUtil)(contents, regexp))
	}
}

export function complexRegexTest(utilName: string, regexUtil: Function) {
	return function (contents: string, ...regexp: any[]) {
		regex(utilName, regexp, () => regexLiteralTest(regexUtil)(contents, regexp))
	}
}

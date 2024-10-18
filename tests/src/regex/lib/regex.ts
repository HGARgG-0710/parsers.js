import { comparisonUtilTest, utilTest } from "lib/lib.js"
import { it } from "node:test"
import { regex_contents } from "../../../../dist/src/regex.js"

export const regexContentsTest = utilTest(regex_contents, "regexContents")

export function regex(utilName: string, regexp: RegExp, post: () => void) {
	it(`regex: [${regexp}] (from ${utilName})`, post)
}

const regexLiteralTest = (util: Function) =>
	comparisonUtilTest(
		(regex: RegExp, contents: string) => regex_contents(regex) === contents
	)(util, "literal")

export function elementaryRegexTest(utilName: string, regexUtil: Function) {
	return function (regexp: RegExp, contents: string) {
		regex(utilName, regexp, () => regexLiteralTest(regexUtil)(regexp, contents))
	}
}

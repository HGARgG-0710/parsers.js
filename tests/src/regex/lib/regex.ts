import { utilTest } from "lib/lib.js"

import { regex as _regex } from "../../../../dist/main.js"
import { complexRegexTest, elementaryRegexTest } from "./lib.js"
const { regex_contents, regex, and, char_ranges } = _regex

export const regex_contents_test = utilTest(regex_contents, "regexContents")
export const regex_test = elementaryRegexTest("regex", regex) as (
	x: string | RegExp,
	string: string
) => void

export const [and_test, char_ranges_test] = [
	["and", and],
	["char_ranges", char_ranges]
].map(([name, util]) => complexRegexTest(name as string, util as Function))

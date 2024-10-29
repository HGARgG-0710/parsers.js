import { utilTest } from "lib/lib.js"

import { regex as _regex } from "../../../../dist/main.js"
import { regexTest } from "./lib.js"
const { regex_contents, and, char_ranges } = _regex

export const regex_contents_test = utilTest(regex_contents, "regex_contents")
export const and_test = regexTest("and", and)
export const char_ranges_test = utilTest(char_ranges, "char_ranges")

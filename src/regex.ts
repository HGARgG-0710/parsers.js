// * Module containing functions for immidiate construction of regular expressions;

import { non_bracket } from "./regex/groups.js"
import { lastIndex } from "./utils.js"

export const char_ranges = (...ranges: (string | [string, string])[]) =>
	ranges.map((r) => (typeof r === "string" ? r : `${r[0]}-${r[1]}`)).join("")

export const regex_contents = (r: RegExp) =>
	((x) => x.slice(1, lastIndex(x) - r.flags.length))(r.toString())

export const and = (...regexes: RegExp[]) => regex(regexes.map(non_bracket).join(""))

export const regex = (string: string | RegExp) => new RegExp(string)

export * as assertions from "./regex/assertions.js"
export * as charclass from "./regex/charclass.js"
export * as flags from "./regex/flags.js"
export * as groups from "./regex/groups.js"
export * as quantifiers from "./regex/quantifiers.js"

export default regex

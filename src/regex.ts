// * Module containing functions for immidiate construction of regular expressions;

import { non_bracket } from "./regex/refactor.js"
import { string } from "@hgargg-0710/one"

const { lastIndex } = string

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

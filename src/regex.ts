// * Module containing functions for immidiate construction of regular expressions;

import { non_bracket } from "./regex/refactor.js"
import { string } from "@hgargg-0710/one"

const { lastIndex } = string

/**
 * Returns the `string` contents of the given regular expression,
 * such that it can be used with `RegExp` constructor to 
 * reconstruct the regular expression. 
 * 
 * Note: the `/` at the sides are missing
 */
export const regex_contents = (r: RegExp) => {
	const contents = r.toString()
	return contents.slice(1, lastIndex(contents) - r.flags.length)
}

/**
 * Returns a regular expression obtained by 
 * concatenating the given `regexes`
*/
export const and = (...regexes: RegExp[]) =>
	regex(regexes.map(non_bracket).join(""))

/**
 * Constructs a regular expression using `from`
 * 
 * If a `string` is given: 
 * 
 * 1. the object will be created without flags
 * 2. `from` must not contain the wrapping `/` RegExp-literal symbols
*/
export const regex = (from: string | RegExp) => new RegExp(from)

export * as assertions from "./regex/assertions.js"
export * as charclass from "./regex/charclass.js"
export * as flags from "./regex/flags.js"
export * as groups from "./regex/groups.js"
export * as quantifiers from "./regex/quantifiers.js"

export default regex

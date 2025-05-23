// * Module containing functions for immidiate construction of regular expressions;

import { string } from "@hgargg-0710/one"
import { non_bracket } from "./regex/refactor.js"

import * as _assertions from "./regex/assertions.js"
import * as _charclass from "./regex/charclass.js"
import * as _flags from "./regex/flags.js"
import * as _groups from "./regex/groups.js"
import * as _quantifiers from "./regex/quantifiers.js"

const { lastIndex } = string

/**
 * Constructs a regular expression using `from`
 *
 * If a `string` is given:
 *
 * 1. the object will be created without flags
 * 2. `from` must not contain the wrapping `/` RegExp-literal symbols
 */
export function regex(from: string | RegExp) {
	return new RegExp(from)
}

export namespace regex {
	/**
	 * The regular expression flag for `RegExp.prototype.global`
	 */
	export const GlobalSearchFlag = "g"

	/**
	 * The regular expression flag for `RegExp.prototype.unicode`
	 */
	export const UnicodeFlag = "u"

	/**
	 * The regular expression flag for `RegExp.prototype.hasIndicies`
	 */
	export const HasIndiciesFlag = "d"

	/**
	 * The regular expression flag for `RegExp.prototype.ignoreCase`
	 */
	export const CaseInsensitiveFlag = "i"

	/**
	 * The regular expression flag for `RegExp.prototype.multiline`
	 */
	export const MultilineFlag = "m"

	/**
	 * The regular expression flag for `RegExp.prototype.unicodeSets`
	 */
	export const UnicodeSetsFlag = "v"

	/**
	 * The regular expression flag for `RegExp.prototype.dotAll`
	 */
	export const DotAllFlag = "s"

	/**
	 * The regular expression flag for `RegExp.prototype.sticky`
	 */
	export const StickyFlag = "y"

	/**
	 * Returns the `string` contents of the given regular expression,
	 * such that it can be used with `RegExp` constructor to
	 * reconstruct the regular expression.
	 *
	 * Note: the `/` at the sides are missing
	 */
	export const contents = (r: RegExp) => {
		const contents = r.toString()
		return contents.slice(1, lastIndex(contents) - r.flags.length)
	}

	/**
	 * Returns a regular expression obtained by
	 * concatenating the given `regexes`
	 */
	export const and = (...regexes: RegExp[]) =>
		regex(regexes.map(non_bracket).join(""))

	export const assertions = _assertions
	export const charclass = _charclass
	export const flags = _flags
	export const groups = _groups
	export const quantifiers = _quantifiers
}

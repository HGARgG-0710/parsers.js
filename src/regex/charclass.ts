import regex from "../regex.js"
import { non_bracket } from "./refactor.js"

const char_ranges = (...ranges: (string | [string, string])[]) =>
	ranges.map((r) => (typeof r === "string" ? r : `${r[0]}-${r[1]}`)).join("")

/**
 * Creates a regular expression containing the character class
 * defined by `ranges` in the following manner:
 *
 * 1. if `ranges[i]` is a string, it is taken to be a single character
 * 2. if `ranges[i]` is a pair of strings, it is taken to be a character range of `ranges[i][0]-ranges[i][1]`
 */
export const charclass = (...ranges: (string | [string, string])[]) =>
	regex(`[${char_ranges(...ranges)}]`)

/**
 * Creates a regular expression containing the complement
 * of the character class defined by `ranges` in the following manner:
 *
 * 1. if `ranges[i]` is a string, it is taken to be a single character
 * 2. if `ranges[i]` is a pair of strings, it is taken to be a character range of `ranges[i][0]-ranges[i][1]`
 */
export const neg_charclass = (...ranges: (string | [string, string])[]) =>
	regex(`[^${char_ranges(...ranges)}]`)

/**
 * Creates a regular expression for the digit character class
 */
export const digit = () => /\d/

/**
 * Creates a regular expression for the complement of the digit character class
 */
export const non_digit = () => /\D/

/**
 * Creates a regular expression for the word character class
 */
export const word = () => /\w/

/**
 * Creates a regular expression for the complement of the word character class
 */
export const non_word = () => /\W/

/**
 * Creates a regular expression for the space character class
 */
export const space = () => /\s/

/**
 * Creates a regular expression for the complement of the space character class
 */
export const non_space = () => /\S/

/**
 * Creates a regular expression for wildcard
 */
export const wildcard = () => /./

/**
 * Creates a regular expression for horizontal tabulation
 */
export const htab = () => /\t/

/**
 * Creates a regular expression for carriage return
 */
export const cr = () => /\r/

/**
 * Creates a regular expression for linefeed
 */
export const lnfeed = () => /\n/

/**
 * Creates a regular expression for form-feed
 */
export const ffeed = () => /\f/

/**
 * Creates a regular expression for a vertical tabulation
 */
export const vtab = () => /\v/

/**
 * Creates a regular expression for a nul-character
 */
export const nil = () => /\0/

const uni_prop_pair = (...x: string[]) => x.join("=")

/**
 * Creates a regular expression for the Unicode character class
 * escape, which would use `property` in the following fashion:
 *
 * 1. If `prop` is a `[string]` is is used as-is, interpreted as a Unicode property
 * 2. If `prop` is a `[string, string]`, it is interpreted as a key-value Unicode property,
 * with `prop[0]` being the key and `prop[1]` being the value
 */
export const uni_prop =
	(...prop: [string] | [string, string]) =>
	() =>
		regex(`\\p{${uni_prop_pair(...prop)}}`)

/**
 * Creates a regular expression for the Unicode character class
 * escape, which would use `property` in the following fashion:
 *
 * 1. If `prop` is a `[string]` is is used as-is, interpreted as a Unicode property
 * 2. If `prop` is a `[string, string]`, it is interpreted as a key-value Unicode property,
 * with `prop[0]` being the key and `prop[1]` being the value
 */
export const non_uni_prop =
	(...prop: [string] | [string, string]) =>
	() =>
		regex(`\\P{${uni_prop_pair(...prop)}}`)

/**
 * Returns a function for creating a regular expression that
 * matches a control character that is comparable to `letter`
 * as a code point mod 32
 */
export const caret = (letter: string) => () => regex(`\\c${letter}`)

/**
 * Returns a function for creating a regular expression that
 * matches a Unicode character with the given hexadecimal unicode
 * code point, defined by `codepoint`.
 *
 * Note: Expects `codepoint` to be precisely 2 hex digits long, and to be
 * either a number, or be a string, written in hex
 */
export const uni_hex_2 = (codepoint: string | number) => () => regex(`\\x${codepoint}`)

/**
 * Returns a function for creating a regular expression that
 * matches a Unicode character with the given hexadecimal unicode
 * code point, defined by `codepoint`.
 *
 * Note: Expects `codepoint` to be precisely 4 hex digits long, and to be
 * either a number, or be a string, written in hex
 */
export const uni_hex_4 = (codepoint: string | number) => () => regex(`\\u${codepoint}`)

/**
 * (Unicode-aware mode only)
 *
 * Returns a function for creating a regular expression that
 * matches a Unicode character with the given hexadecimal unicode
 * code point, defined by `codepoint`.
 *
 * Note: Expects `codepoint` to be precisely between 1 and 6 hex digits long, and to be
 * either a number, or be a string, written in hex
 */
export const uni_hex = (code: string | number) => () => regex(`\\u{${code}}`)

/**
 * Creates a regular expression defined as the disjunction of `regexes`
 */
export const or = (...regexes: RegExp[]) => regex(regexes.map(non_bracket).join("|"))

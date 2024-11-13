import regex, { char_ranges } from "../regex.js"
import { non_bracket } from "./groups.js"

import { function as _f, typeof as type } from "@hgargg-0710/one"
const { id } = _f
const { isArray } = type

export const [charclass, neg_charclass] = ["", "^"].map(
	(append) =>
		(...ranges: (string | [string, string])[]) =>
			regex(`[${append}${char_ranges(...ranges)}]`)
)

export const [[digit, non_digit], [word, non_word], [space, non_space]] = [
	"d",
	"w",
	"s"
].map((pairLetter) =>
	[id, (x: string) => x.toUpperCase()].map((f) => () => regex(`\\${f(pairLetter)}`))
)

export const wildcard = () => /./
export const htab = () => /\t/
export const cr = () => /\r/
export const lnfeed = () => /\n/
export const ffeed = () => /\f/
export const vtab = () => /\v/
export const nil = () => /\0/

const uni_prop_pair = (x: string | [string, string]) =>
	isArray(x) ? `${x[0]}=${x[1]}` : x

export const uni_hex_5 = (code: string | number) => () => regex(`\\u{${code}}`)
export const [uni_prop, non_uni_prop] = ["p", "P"].map(
	(l) => (code: string | [string, string]) => () =>
		regex(`\\${l}{${uni_prop_pair(code)}}`)
)

export const [caret, uni_hex_2, uni_hex_4] = ["c", "x", "u"].map(
	(l) => (letter: string | number) => () => regex(`\\${l}${letter}`)
)

export const or = (...regexes: RegExp[]) => regex(regexes.map(non_bracket).join("|"))

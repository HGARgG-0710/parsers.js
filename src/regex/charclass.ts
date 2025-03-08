import regex from "../regex.js"
import { char_ranges } from "./refactor.js"
import { non_bracket } from "./refactor.js"

import { type } from "@hgargg-0710/one"
const { isArray } = type

export const charclass = (...ranges: (string | [string, string])[]) =>
	regex(`[${char_ranges(...ranges)}]`)

export const neg_charclass = (...ranges: (string | [string, string])[]) =>
	regex(`[^${char_ranges(...ranges)}]`)

export const digit = () => /\d/
export const non_digit = () => /\D/
export const word = () => /\w/
export const non_word = () => /\W/
export const space = () => /\s/
export const non_space = () => /\S/
export const wildcard = () => /./
export const htab = () => /\t/
export const cr = () => /\r/
export const lnfeed = () => /\n/
export const ffeed = () => /\f/
export const vtab = () => /\v/
export const nil = () => /\0/

const uni_prop_pair = (x: string | [string, string]) =>
	isArray(x) ? `${x[0]}=${x[1]}` : x

export const uni_prop = (code: string | [string, string]) => () =>
	regex(`\\p{${uni_prop_pair(code)}}`)

export const non_uni_prop = (code: string | [string, string]) => () =>
	regex(`\\P{${uni_prop_pair(code)}}`)

export const caret = (letter: string | number) => () => regex(`\\c${letter}`)
export const uni_hex_2 = (letter: string | number) => () => regex(`\\x${letter}`)
export const uni_hex_4 = (letter: string | number) => () => regex(`\\u${letter}`)
export const uni_hex_5 = (code: string | number) => () => regex(`\\u{${code}}`)

export const or = (...regexes: RegExp[]) => regex(regexes.map(non_bracket).join("|"))

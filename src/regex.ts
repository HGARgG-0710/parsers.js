// * Module containing functions for immidiate construction of regular expressions;

import { typeof as type } from "@hgargg-0710/one"
const { isArray } = type

const charRanges = (...ranges: (string | [string, string])[]) =>
	ranges.map((r) => (typeof r === "string" ? r : `${r[0]}-${r[1]}`)).join("")

export const regexContents = (r: RegExp) =>
	((x) => x.slice(1, x.length - 1 - r.flags.length))(r.toString())

const [bracket, nonBracket] = ["", "?:"].map(
	(s) => (regex: RegExp) => `(${s}${regexContents(regex)})`
)

export const [capture, nonCapture] = [bracket, nonBracket].map(
	(f) => (regex: RegExp) => new RegExp(f(regex))
)

export const namedCapture = (name: string) => (regex: RegExp) =>
	new RegExp(`(?<${name}>${nonBracket(regex)})`)

export const [and, or] = ["", "|"].map(
	(sym) =>
		(...regexes: RegExp[]) =>
			new RegExp(nonBracket(new RegExp(regexes.map(nonBracket).join(sym))))
)

export const flagsAdd = (flags: string) => (regex: RegExp) =>
	new RegExp(regex, regex.flags.concat(flags))

export const [
	global,
	unicode,
	subInd,
	caseInsensitive,
	multline,
	unicodeSets,
	dotAll,
	sticky
] = ["g", "u", "d", "i", "m", "v", "s", "y"].map(flagsAdd)

export function occurences(...args: [number, (number | string)?]) {
	return (regex: RegExp) =>
		new RegExp(`${nonBracket(regex)}{${args.slice(0, 2).join(",")}}`)
}

export const [begin, end] = ["^", "$"].map(
	(marker, i) => (regex: RegExp) =>
		new RegExp(`${i ? "" : marker}${regexContents(regex)}${i ? marker : ""}`)
)

export const [plookahead, nlookahead, lookbehind, nlookbehind] = [
	"?=",
	"?!",
	"?<=",
	"?<!"
].map(
	(sym, i) => (regex: RegExp) =>
		new RegExp(`(${i < 2 ? "" : sym}${nonBracket(regex)}${i >= 2 ? "" : sym})`)
)

export const [boundry, Boundry] = ["b", "B"].map((b) => () => new RegExp(`\\${b}`))

export const [charClass, negCharClass] = ["", "^"].map(
	(append) =>
		(...ranges: (string | [string, string])[]) =>
			new RegExp(`[${append}${charRanges(...ranges)}]`)
)

export const [[digit, nonDigit], [word, nonWord], [space, nonSpace]] = [
	"d",
	"w",
	"s"
].map((pairLetter) =>
	[(x: any) => x, (x: string) => x.toUpperCase()].map(
		(f) => () => new RegExp(`\\${f(pairLetter)}`)
	)
)

export const anything = () => /./
export const tab = () => /\t/
export const cr = () => /\r/
export const newline = () => /\n/
export const vtab = () => /\v/
export const form = () => /\f/
export const nil = () => /\0/

export const [caret, hex, utf16] = ["c", "x", "u"].map(
	(l) => (letter: string) => () => new RegExp(`\\${l}${letter}`)
)

export const [plus, star, maybe] = ["+", "*", "?"].map(
	(s) => (regex: RegExp) => new RegExp(`${nonBracket(regex)}${s}`)
)

const uniProp = (x: string | [string, string]) => (isArray(x) ? `${x[0]}=${x[1]}` : x)
export const uniAware = (code: string) => () => new RegExp(`\\u{${code}}`)
export const [uniEsc, uniEscNon] = ["p", "P"].map(
	(l) => (code: string | [string, string]) => () =>
		new RegExp(`\\${l}{${uniProp(code)}}`)
)

export const backrefName = (name: string) => () => new RegExp(`\\k<${name}>`)
export const backrefIndex = (index: number | string) => () => new RegExp(`\\${index}`)

export const nogreedy = (regex: RegExp) => new RegExp(`${regexContents(regex)}?`)

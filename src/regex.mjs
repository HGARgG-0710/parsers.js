// * Module containing functions for immidiate construction of regular expressions;

const charRanges = (...ranges) =>
	ranges.map((r) => (r instanceof Array ? `${r[0]}-${r[1]}` : r[0])).join("")

export const regexContents = (r) =>
	((x) => x.slice(1, x.length - 1 - r.flags.length))(r.toString())

const [bracket, nonBracket] = ["", "?:"].map(
	(s) => (regex) => `(${s}${regexContents(regex)})`
)
export const [capture, nonCapture] = [bracket, nonBracket].map(
	(f) => (regex) => new RegExp(f(regex))
)

export const namedCapture = (name) => (regex) =>
	new RegExp(`(?<${name}>${nonBracket(regex)})`)

export const [and, or] = ["", "|"].map(
	(sym) =>
		(...regexes) =>
			new RegExp(nonBracket(new RegExp(regexes.map(nonBracket).join(sym))))
)
export const flagsAdd = (flags) => (regex) => new RegExp(regex, regex.flags.concat(flags))

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

export function occurences(...args) {
	return (regex) => new RegExp(`${nonBracket(regex)}{${args.slice(0, 2).join(",")}}`)
}

export const [begin, end] = ["^", "$"].map(
	(marker, i) => (regex) =>
		new RegExp(`${i ? "" : marker}${regexContents(regex)}${i ? marker : ""}`)
)

export const [plookahead, nlookahead, lookbehind, nlookbehind] = [
	"?=",
	"?!",
	"?<=",
	"?<!"
].map(
	(sym, i) => (regex) =>
		new RegExp(`(${i < 2 ? "" : sym}${nonBracket(regex)}${i >= 2 ? "" : sym})`)
)

export const [boundry, Boundry] = ["b", "B"].map((b) => () => new RegExp(`\\${b}`))

export const [charClass, negCharClass] = ["", "^"].map(
	(append) =>
		(...ranges) =>
			new RegExp(`[${append}${charRanges(...ranges)}]`)
)

export const [[digit, nonDigit], [word, nonWord], [space, nonSpace]] = [
	"d",
	"w",
	"s"
].map((pairLetter) =>
	[(x) => x, (x) => x.toUpperCase()].map((f) => () => new RegExp(`\\${f(pairLetter)}`))
)

export const anything = () => /./
export const tab = () => /\t/
export const cr = () => /\r/
export const newline = () => /\n/
export const vtab = () => /\v/
export const form = () => /\f/
export const nil = () => /\0/

export const [caret, hex, utf16] = ["c", "x", "u"].map(
	(l) => (letter) => () => new RegExp(`\\${l}${letter}`)
)

export const [plus, star, maybe] = ["+", "*", "?"].map(
	(s) => (regex) => new RegExp(`${nonBracket(regex)}${s}`)
)

const uniProp = (x) => (x instanceof Array ? `${x[0]}=${x[1]}` : x)
export const [uniAware, uniEsc, uniEscNon] = ["u", "p", "P"].map(
	(l, i) => (code) => () => new RegExp(`\\${l}{${(i ? uniProp : (x) => x)(code)}}`)
)

export const backrefName = (name) => () => new RegExp(`\\k<${name}>`)
export const backrefIndex = (index) => () => new RegExp(`\\${index}`)

export const nogreedy = (regex) => new RegExp(`${regexContents(regex)}?`)

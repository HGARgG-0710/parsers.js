// * Module containing functions for immidiate construction of regular expressions;

// ! this is [largely] very good, HOWEVER...
// ? this 'bracket' thing seems slightly suspicious. On one hand - it provides the needed order to ensure the following of the operations being the same as the user defined them ('intuitiveness' of construction...). 
// ! on the other - it (might) ruin some of the more intricate outputs of Regular Expressions (so it's not a perfect fit, though certainly does fit the basic purposes of the parsers currently available - first match, that is...); 
// % See if one can do anything about this order issue...

export const regexpRanges = (...ranges) =>
	ranges
		.map((r) => r.map(regexpContents))
		.map((r) => (r.length > 1 ? `${r[0]}-${r[1]}` : r[0]))
		.join("")

export const regexpContents = (r) =>
	((x) => x.slice(1, x.length - 1 - r.flags.length))(r.toString())

export const bracket = (regexp) => `(${regexpContents(regexp)})`
export const capture = (regexp) => new RegExp(bracket(regexp))
export const nonCapture = (regex) => new RegExp(`(?:${regexpContents(regex)})`)
export const namedCapture = (name) => (regex) => new RegExp(`(?<${name}>${regex}`)

export const [and, or] = ["", "|"].map(
	(sym) =>
		(...regexes) =>
			new RegExp(regexes.map(bracket).join(sym))
)
export const flagAdd = (flag) => (regexp) => new RegExp(regexp, [flag])

export const [global, unicode] = ["g", "u"].map(flagAdd)

export function occurences(...args) {
	return (regexp) => new RegExp(`${bracket(regexp)}{${args.slice(0, 2).join(",")}}`)
}

export const [begin, end] = ["^", "$"].map(
	(marker, i) => (regex) =>
		new RegExp(`${i ? "" : marker}${bracket(regex)}${i ? marker : ""}`)
)

export const [plookahead, nlookahead, plookbehind, nlookbehind] = [
	"?=",
	"?!",
	"?<=",
	"?<!"
].map(
	(sym, i) => (regex) =>
		new RegExp(`(${i < 2 ? "" : sym}${bracket(regex)}${i >= 2 ? "" : sym})`)
)

export const [boundry, Boundry] = ["b", "B"].map((b) => () => new RegExp(`\\${b}`))

export const [charClass, negCharClass] = ["", "^"].map(
	(append) =>
		(...ranges) =>
			new RegExp(`[${append}${regexpRanges(...ranges)}]`)
)

export const anything = () => /./

export const [[digit, nonDigit], [word, nonWord], [space, nonSpace]] = [
	"d",
	"w",
	"s"
].map((pairLetter) =>
	[(x) => x, (x) => x.toUpperCase()].map((f) => () => new RegExp(`\\${f(pairLetter)}`))
)

export const tab = () => /\t/
export const cr = () => /\r/
export const newline = () => /\n/
export const vtab = () => /\v/
export const form = () => /\f/
export const nul = () => /\0/

export const [caret, hex, utf16] = ["c", "x", "u"].map(
	(l) => (letter) => () => new RegExp(`\\${l}${letter}`)
)

export const [plus, star, any] = ["+", "*", "?"].map(
	(s) => (regex) => new RegExp(`${bracket(regex)}${s}`)
)
export const [uniAware, uniEsc, uniEscNon] = ["u", "p", "P"].map(
	(l) => (code) => () => new RegExp(`\\${l}{${code}}`)
)
export const backref = (name) => (regexp) => new RegExp(`${bracket(regexp)}\\k<${name}>`)
export const nogreedy = (regex) => new RegExp(`${regexpContents(regex)}?`)

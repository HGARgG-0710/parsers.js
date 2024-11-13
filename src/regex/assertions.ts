import regex, { regex_contents } from "../regex.js"

export const [lookahead, neg_lookahead, lookbehind, neg_lookbehind] = [
	"?=",
	"?!",
	"?<=",
	"?<!"
].map((sym) => (regexp: RegExp) => regex(`(${sym}${regex_contents(regexp)})`))

export const word_boundry = () => regex("\\b")
export const non_word_boundry = () => regex("\\B")
export const begin = (regexp: RegExp) => regex(`^${regex_contents(regexp)}`)
export const end = (regexp: RegExp) => regex(`${regex_contents(regexp)}$`)

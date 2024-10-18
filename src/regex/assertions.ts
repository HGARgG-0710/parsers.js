import regex, { regex_contents } from "src/regex.js"
import { non_bracket } from "./groups.js"

export const [lookahead, neg_lookahead, lookbehind, neg_lookbehind] = [
	"?=",
	"?!",
	"?<=",
	"?<!"
].map(
	(sym, i) => (regexp: RegExp) =>
		regex(`(${i < 2 ? "" : sym}${non_bracket(regexp)}${i >= 2 ? "" : sym})`)
)

export const [word_boundry, non_word_boundry] = ["b", "B"].map(
	(b) => () => regex(`\\${b}`)
)

export const [begin, end] = ["^", "$"].map(
	(marker, i) => (regexp: RegExp) =>
		regex(`${i ? "" : marker}${regex_contents(regexp)}${i ? marker : ""}`)
)

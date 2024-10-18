import regex, { regex_contents } from "src/regex.js"

export const bracket = (regex: RegExp) => `(${regex_contents(regex)})`
export const non_bracket = (regex: RegExp) => `(?:${regex_contents(regex)})`

export const [capture, non_capture] = [bracket, non_bracket].map(
	(f) => (regexp: RegExp) => regex(f(regexp))
)

export const named_capture = (name: string) => (regexp: RegExp) =>
	regex(`(?<${name}>${non_bracket(regexp)})`)

export const bref = (index: number | string) => () => regex(`\\${index}`)
export const named_bref = (name: string) => () => regex(`\\k<${name}>`)

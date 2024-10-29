import regex, { regex_contents } from "src/regex.js"
import { non_bracket } from "./groups.js"

export function occurrences(...args: [number, (number | "")?]) {
	return (regexp: RegExp) =>
		regex(`${non_bracket(regexp)}{${args.slice(0, 2).join(",")}}`)
}

export const non_greedy = (regexp: RegExp) => regex(`${regex_contents(regexp)}?`)
export const [plus, star, maybe] = ["+", "*", "?"].map(
	(s) => (regexp: RegExp) => regex(`${non_bracket(regexp)}${s}`)
)

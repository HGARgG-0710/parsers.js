import regex, { regex_contents } from "../regex.js"
import { non_bracket } from "./refactor.js"

export function occurrences(...args: [number, (number | "")?]) {
	return (regexp: RegExp) =>
		regex(`${non_bracket(regexp)}{${args.slice(0, 2).join(",")}}`)
}

export const non_greedy = (regexp: RegExp) => regex(`${regex_contents(regexp)}?`)

export const some = (regexp: RegExp) => regex(`${non_bracket(regexp)}+`)
export const any = (regexp: RegExp) => regex(`${non_bracket(regexp)}*`)
export const maybe = (regexp: RegExp) => regex(`${non_bracket(regexp)}?`)

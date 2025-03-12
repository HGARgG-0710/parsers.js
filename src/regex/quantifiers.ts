import regex, { regex_contents } from "../regex.js"
import { non_bracket } from "./refactor.js"

/**
 * Returns a function for creating a regular expression defined by
 * repeating `regexp` a number of occurences defined by args thusly:
 *
 * 1. if `args.length === 1`, it matches when `regexp` is repeated
 * precisely `args[0]` times
 *
 * 2. if `args.length === 2` and `args[1] !== ""`,
 * it matches when `regexp` is repeated between `args[0]` and `args[1]`
 * inclusively
 *
 * 3. if `args.length === 2` and `args[1] === ""`,
 * it matches at least `args[0]` repetitions of `regexp`
 */
export function occurrences(...args: [number, (number | "")?]) {
	return (regexp: RegExp) =>
		regex(`${non_bracket(regexp)}{${args.slice(0, 2).join(",")}}`)
}

/**
 * (Requies `regexp` to end on a greedy version
 * of a quantifier: *, ?, +, {n, m}, ...)
 *
 * Returns a non-greedy version of `regexp`
 */
export const non_greedy = (regexp: RegExp) => regex(`${regex_contents(regexp)}?`)

/**
 * Returns a regular expression that matches `regexp`
 * at least one occurence of `regexp`
 */
export const some = (regexp: RegExp) => regex(`${non_bracket(regexp)}+`)

/**
 * Returns a regular expression that matches 0 or more
 * repetitions of `regexp`
 */
export const any = (regexp: RegExp) => regex(`${non_bracket(regexp)}*`)

/**
 * Returns a regular expression that inclusively matches
 * between 0 and 1 occurences of `regexp`
 */
export const maybe = (regexp: RegExp) => regex(`${non_bracket(regexp)}?`)

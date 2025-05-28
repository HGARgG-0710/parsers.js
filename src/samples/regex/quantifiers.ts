import { regex } from "../regex.js"
import { non_bracket } from "./refactor.js"

/**
 * Returns a function that creates a regular expression that
 * matches when `regexp` is repeated precisely `times` times
 */
export const repeat = (times: number) => (regexp: RegExp) =>
	regex(`${non_bracket(regexp)}{${times}}`)

/**
 * Returns a function for creating a regular that matches
 * when `regexp` is repeated between `from` and `to` inclusively
 */
export const multiple = (from: number, to: number) => (regexp: RegExp) =>
	regex(`${non_bracket(regexp)}{${from},${to}}}`)

/**
 * Returns a function for creation of regular expression
 * that matches at least `times` repetitions of `regexp`
 */
export const indefinite = (times: number) => (regexp: RegExp) =>
	regex(`${non_bracket(regexp)}{${times},}`)

/**
 * (Requies `regexp` to end on a greedy version
 * of a quantifier: *, ?, +, {n, m}, ...)
 *
 * Returns a non-greedy version of `regexp`
 */
export const non_greedy = (regexp: RegExp) =>
	regex(`${regex.contents(regexp)}?`)

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

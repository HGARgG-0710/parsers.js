import { functional } from "@hgargg-0710/one"
import { regex } from "../regex.js"
import { non_bracket } from "./refactor.js"

const { trivialCompose } = functional

/**
 * Creates a regular expression defined by putting
 * `regexp` inside a capture group
 */
export const capture = (regexp: RegExp) => regex(`(${regex.contents(regexp)})`)

/**
 * Creates a regular expression defined by putting `regexp` inside a
 * non-capture group
 */
export const non_capture = trivialCompose(regex, non_bracket) as (
	regexp: RegExp
) => RegExp

/**
 * Returns a function for creating a regular expression
 * defined by putting `regexp` into a named-capture
 * using `name` as its name
 */
export const named_capture = (name: string) => (regexp: RegExp) =>
	regex(`(?<${name}>${regexp})`)

/**
 * Returns a function for creating a regular expression
 * defined by a backreference using `index`
 */
export const backref = (index: number | string) => () => regex(`\\${index}`)

/**
 * Returns a function for creating a regular expression defined
 * by a named backreference using `name`
 */
export const named_backref = (name: string) => () => regex(`\\k<${name}>`)

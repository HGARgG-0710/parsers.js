import regex, { regex_contents } from "../regex.js"

/**
 * Creates a regular expression containing the `regexp`
 * inside a lookahead
 */
export const lookahead = (regexp: RegExp) => regex(`(?=${regex_contents(regexp)})`)

/**
 * Creates a regular expression containing the `regex_contents`
 * inside a negative lookahead
 */
export const neg_lookahead = (regexp: RegExp) => regex(`(?!${regex_contents(regexp)})`)

/**
 * Creates a regular expression containing `regexp`
 * inside a lookbehind
 */
export const lookbehind = (regexp: RegExp) => regex(`(?<=${regex_contents(regexp)})`)

/**
 * Creates a regular expression containing `regexp`
 * inside a negative lookbehind
 */
export const neg_lookbehind = (regexp: RegExp) => regex(`(?<!${regex_contents(regexp)})`)

/**
 * Creates a regular expression for word boundry assertion
 */
export const word_boundry = () => /\b/

/**
 * Creates a regular expression for negation of word boundry assertion
 */
export const non_word_boundry = () => /\B/

/**
 * Creates a regular expression beginning with `regexp`
 */
export const begin = (regexp: RegExp) => regex(`^${regex_contents(regexp)}`)

/**
 * Creates a regular expression that ends with `regexp`
 */
export const end = (regexp: RegExp) => regex(`${regex_contents(regexp)}$`)

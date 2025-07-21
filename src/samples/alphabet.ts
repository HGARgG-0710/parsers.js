import { array } from "@hgargg-0710/one"

const { numbers } = array

/**
 * An array of strings for decimal digits
 */
export const decimal = numbers(10).map(String)

/**
 * An array of strings for binary digits
 */
export const binary = numbers(2).map(String)

/**
 * An array of strings for hexidecimal digits
 */
export const hex = decimal.concat(["a", "b", "c", "d", "e", "f"])

/**
 * Given a string, returns whether it's a valid binary number
 */
export const isBinary = (x: string) => /^[01]+$/.test(x)

/**
 * Given a string, return whether it's a valid decimal number
 */
export const isDecimal = (x: string) => /^[0-9]+$/.test(x)

/**
 * Given a string, returns whether it's a valid hexidecimal number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

/**
 * Given a string, returns whether it's a valid identifier (or a portion of one).
 * Checks for an id that starts with a lower- or upper- case letter or a _ symbol,
 * and continues either with a lower-/upper- case letter, _ symbol, or digits from
 * 0 to 9.
 *
 * Note: The "letter" here is employed in a Unicode context, i.e.
 * foreign letters too work as a identifiers.
 */
export const isIdentifier = (x: string) => /^[A-Za-z_]\w+$/u.test(x)

/**
 * Verifies that a given string is a sequence of `"\n"`, `"\t"`, and `" "` characters.
 */
export const isSpace = (x: string) => /^\s+$/.test(x)

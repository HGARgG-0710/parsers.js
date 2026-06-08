import { array } from "@hgargg-0710/one"
import assert from "node:assert"
import type { IHaving } from "../interfaces.js"

const { numbers } = array

/**
 * A class for representing a finite indexed collection,
 * with an inclusion operation.
 */
export class Alphabet implements IHaving {
	private readonly asSet: Set<string>

	static fromRange(start: number, end: number) {
		assert(start <= end)
		const codepoints: string[] = []
		for (let i = start; i <= end; ++i)
			codepoints.push(String.fromCodePoint(i))
		return new Alphabet(codepoints)
	}

	has(item: string) {
		return this.asSet.has(item)
	}

	get(index: number) {
		return this.letters[index]
	}

	with(...newLetters: readonly string[]) {
		return new Alphabet(this.letters.concat(newLetters))
	}

	concat(alphabet: Alphabet): Alphabet {
		return new Alphabet(this.letters.concat(alphabet.letters))
	}

	map(
		f: (letter: string, i: number, letters: string[]) => string,
	): Alphabet {
		return new Alphabet(this.letters.map(f))
	}

	constructor(private readonly letters: readonly string[]) {
		this.asSet = new Set(letters)
	}
}

/**
 * An `Alphabet` of strings for decimal digits
 */
export const decimal = new Alphabet(numbers(10).map(String))

/**
 * An `Alphabet` of strings for binary digits
 */
export const binary = new Alphabet(numbers(2).map(String))

/**
 * An `Alphabet` of english letters (lowercase and uppercase)
 */
export const english = Alphabet.fromRange(65, 90).concat(
	Alphabet.fromRange(97, 122),
)

/**
 * An `Alphabet` of strings for first identifier characters
 */
export const firstId = english.with("_")

/**
 * An `Alphabet` of strings for non-first identifier characters
 */
export const id = firstId.concat(decimal)

/**
 * An `Alphabet` of strings for hexidecimal digits
 */
export const hex = decimal.with("a", "b", "c", "d", "e", "f")

/**
 * An `Alphabet` of space characters (note: CRLF is not supported)
 */
export const spaces = new Alphabet([" ", "\n", "\t", "\v", "\f"])

export function hasSequence(alphabet: Alphabet) {
	return function (sequence: string): boolean {
		for (let i = 0; i < sequence.length; ++i)
			if (!alphabet.has(sequence[i])) return false
		return true
	}
}

/**
 * Given a string, returns whether it's a valid binary number
 */
export const isBinary = hasSequence(binary)

/**
 * Given a string, return whether it's a valid decimal number
 */
export const isDecimal = hasSequence(decimal)

/**
 * Given a string, returns whether it's a valid hexidecimal number
 */
const isHexLowercase = hasSequence(hex)
export function isHex(x: string): boolean {
	return isHexLowercase(x.toLowerCase())
}

/**
 * Given a string, returns whether it's a valid identifier (or a portion of one).
 * Checks for an id that starts with a lower- or upper- case letter or a _ symbol,
 * and continues either with a lower-/upper- case letter, _ symbol, or digits from
 * 0 to 9.
 */
const isRestLegalIdentifier = hasSequence(id)
export function isIdentifier(x: string) {
	if (!firstId.has(x)) return false
	return isRestLegalIdentifier(x.slice(1))
}

export const isNonDigitId = hasSequence(firstId)

/**
 * Verifies that a given string is a sequence of `"\n"`, `"\t"`, and `" "` characters.
 */
export const isSpace = hasSequence(spaces)

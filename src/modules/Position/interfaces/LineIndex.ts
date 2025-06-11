import type { ICopiable } from "../../../interfaces.js"

/**
 * This is an interface for representing a character-line
 * pair of numbers for representation of the current position
 * inside a file. It can be useful for various practical
 * purposes such as diagnostics during course of input
 * validation and error output.
 */
export interface ILineIndex extends ICopiable {
	readonly char: number
	readonly line: number
	nextChar(): void
	nextLine(): void
	prevChar?(): void
}

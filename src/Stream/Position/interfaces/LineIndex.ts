import type { ICopiable } from "../../../interfaces.js"

export interface ILineIndex extends ICopiable {
	readonly char: number
	readonly line: number
	nextChar(): void
	nextLine(): void
	prevChar?(): void
}

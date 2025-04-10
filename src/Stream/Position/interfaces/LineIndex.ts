import type { IPositionObject } from "../interfaces.js"

export interface ILineIndex extends IPositionObject {
	nextChar(): void
	nextLine(): void
	
	readonly char: number
	readonly line: number
}

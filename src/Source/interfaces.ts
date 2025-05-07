import type { ICopiable, IStreamIdentifiable } from "../interfaces.js"

export interface ISource extends ICopiable, IStreamIdentifiable {
	hasChars(): boolean
	nextChar(n?: number): void
	cleanup(): void
	decoded: string
	pos: number
}

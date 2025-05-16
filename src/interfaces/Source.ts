import type { ICopiable } from "../interfaces.js"

export interface ISource extends ICopiable {
	hasChars(): boolean
	nextChar(n?: number): void
	cleanup(): void
	readonly decoded: string
	readonly pos: number
}

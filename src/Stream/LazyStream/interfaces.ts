import type { ICopiable } from "../../interfaces.js"

export interface ISource extends ICopiable {
	hasChars(): boolean
	nextChar(n?: number): void
	cleanup(): void
	decoded: string
}

import type { ICopiable } from "../../interfaces.js"

export interface ISource extends ICopiable {
	hasChars(): boolean
	nextChar(): void
	cleanup(): void
	decoded: string
}

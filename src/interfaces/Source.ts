import type { ICopiable, IResource } from "../interfaces.js"

export interface ISource extends ICopiable, IResource {
	hasChars(): boolean
	nextChar(n?: number): void
	readonly decoded: string
	readonly pos: number
}

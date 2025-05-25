import type { ICopiable, IIsOpen, IResource } from "../interfaces.js"

export interface ISource extends ICopiable, IResource, IIsOpen {
	hasChars: () => boolean
	nextChar: (n?: number) => void
	rewind: () => void
	readonly decoded: string
	readonly pos: number
}

import type { ICopiable, IIsOpen, IPosed, IResource } from "../interfaces.js"

/**
 * This is an interface for representing a lazily readable `IResource`,
 * which can be `.rewind()`-ed (and, hence, reused), and the position of
 * which can be tracked via the `readonly .pos: number`
 */
export interface ISource extends ICopiable, IResource, IIsOpen, IPosed<number> {
	hasChars: () => boolean
	nextChar: (n?: number) => void
	rewind: () => void
	readonly decoded: string
}

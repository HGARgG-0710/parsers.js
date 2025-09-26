import type { ICopiable, IResource, IVisiblyOpen } from "../interfaces.js"

/**
 * This is an interface for representing a lazily readable
 * `IResource` of `string` literals (supposedly of length of 1),
 * which can be `.rewind()`-ed (and, hence, reused), and the
 * position of which can be tracked via the `readonly .pos: number`
 */
export interface ICharacterSource extends ICopiable, IResource, IVisiblyOpen {
	hasChars: () => boolean
	nextChar: () => void
	readonly decoded: string
}

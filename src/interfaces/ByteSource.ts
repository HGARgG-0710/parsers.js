import type { ICopiable, IResource, IVisiblyOpen } from "../interfaces.js"

/**
 * This is an interface for representing a source for
 * bytes, accessed via the `.currByte` property, the
 * value of which can be changed to the byte after the
 * current one via the call to `nextByte()`.
 */
export interface IByteSource extends ICopiable, IResource, IVisiblyOpen {
	readonly currByte: number
	nextByte(): void
	hasBytes(): boolean
}

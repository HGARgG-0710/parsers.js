import type { IResource, IVisiblyOpen } from "../interfaces.js"

/**
 * This is an interface for representing a source for
 * bytes, accessed via the `.currByte` property, the
 * value of which can be changed to the byte after the
 * current one via the call to `nextByte()`.
 */
export interface IByteSource extends IResource, IVisiblyOpen {
	readonly currByte: number
	nextByte(): void
	hasBytes(): boolean
}

/**
 * This is an `IByteSource` that corresponds to a file. 
 * It carries various additional information such as 
 * the `filename: string`. 
*/
export interface IFileSource extends IByteSource {
	readonly filename: string
}
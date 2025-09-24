import type { ILinkedStream } from "./OwnedStream.js"

/**
 * This is a `IdentityStream<T>` with a `readonly currStored: Stored`,
 * representing the current "adjoint" value to the already present
 * `.curr`, taken from the `.resource: IOwnedStream<T>`.
 */
export type IStorageStream<T = any, Stored = any> = ILinkedStream<T> & {
	readonly currStored: Stored
}

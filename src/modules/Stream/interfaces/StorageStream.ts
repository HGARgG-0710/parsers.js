import type { IdentityStreamAnnotation } from "../../../classes/Stream.js"

/**
 * This is a `IdentityStream<T>` with a `readonly currStored: Stored`,
 * representing the current "adjoint" value to the already present
 * `.curr`, taken from the `.resource: IOwnedStream<T>`.
 */
export type IStorageStream<
	T = any,
	Stored = any
> = IdentityStreamAnnotation<T> & {
	readonly currStored: Stored
}

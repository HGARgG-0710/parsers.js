import type { IdentityStreamAnnotation } from "../../../classes/Stream.js"

/**
 * This is a `IdentityStream<T>` with a `readonly currMarker: Marker`,
 * representing the current "adjoint" value to the already present
 * `.curr`, taken from the `.resource: IOwnedStream<T>`.
 */
export type IMarkerStream<
	T = any,
	Marker = any
> = IdentityStreamAnnotation<T> & {
	readonly currMarker: Marker
}

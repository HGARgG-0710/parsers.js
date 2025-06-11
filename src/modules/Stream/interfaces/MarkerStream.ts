import type { WrapperStreamAnnotation } from "../../../classes/Stream.js"

/**
 * This is a `WrapperStream<T>` with a `readonly currMarker: Marker`,
 * representing the current "adjoint" value to the already present
 * `.curr`, taken from the `.resource: IOwnedStream<T>`.
 */
export type IMarkerStream<
	T = any,
	Marker = any
> = WrapperStreamAnnotation<T> & {
	readonly currMarker: Marker
}

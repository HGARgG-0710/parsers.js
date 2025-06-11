import type { WrapperStreamAnnotation } from "../../../classes/Stream.js"

export type IMarkerStream<
	T = any,
	Marker = any
> = WrapperStreamAnnotation<T> & {
	readonly currMarker: Marker
}

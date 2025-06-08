import type { WrapperStreamAnnotation } from "../../../classes/Stream.js"

export type IMarkerStream<
	Type = any,
	MarkerType = any
> = WrapperStreamAnnotation<Type> & {
	readonly currMarker: MarkerType
}

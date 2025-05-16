import type { WrapperStream } from "../../classes/Stream.js"

export type IMarkerStream<
	Type = any,
	MarkerType = any
> = WrapperStream<Type> & {
	readonly currMarker: MarkerType
}

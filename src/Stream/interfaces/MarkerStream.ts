import type { WrapperStream } from "../classes.js"

export type IMarkerStream<
	Type = any,
	MarkerType = any
> = WrapperStream<Type> & {
	readonly currMarked: MarkerType
}

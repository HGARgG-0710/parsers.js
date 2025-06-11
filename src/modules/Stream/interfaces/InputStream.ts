import type { IInitializable } from "../../../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IInputStream<T = any, InitType = any> = IOwnedStream<T> &
	IInitializable<[InitType]>

export type ISourcedStream<
	T = any,
	SourceType = any
> = IOwnedStream<T> & {
	readonly source?: SourceType
}

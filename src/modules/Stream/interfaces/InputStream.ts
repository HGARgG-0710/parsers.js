import type { IInitializable } from "../../../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

export type IInputStream<Type = any, InitType = any> = IOwnedStream<Type> &
	IInitializable<[InitType]>

export type ISourcedStream<
	Type = any,
	SourceType = any
> = IOwnedStream<Type> & {
	readonly source?: SourceType
}

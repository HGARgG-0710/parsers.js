import type { IInitializable } from "../../../interfaces.js"
import type { IOwnedStream } from "./OwnedStream.js"

/**
 * This is an `IOwnedStream<T>`, `.init()`ializable with `InitType`.
 */
export type IInputStream<T = any, InitType = any> = IOwnedStream<T> &
	IInitializable<[InitType]>

/**
 * This is an `IOwnedStream<T>` with a `readonly source?: SourceType`,
 * which represents some form of origin for data somehow used by the stream
 * in question.
 */
export type ISourcedStream<T = any, SourceType = any> = IOwnedStream<T> & {
	readonly source?: SourceType
}

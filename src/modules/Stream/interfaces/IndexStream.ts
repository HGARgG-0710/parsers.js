import type { ILineIndex } from "../../../interfaces.js"
import type { ILinkedStream, IOwnedStream } from "./OwnedStream.js"

/**
 * This is an `ILinkedStream<T>`, supplemented with an
 * `readonly lineIndex: ILineIndex` property, which is
 * intended to keep track of the stream's current
 * line-character (which do not necesserily have to mean a
 * string).
 */
export type IIndexStream<T = any> = ILinkedStream<T> & IIndexCarrying

/**
 * Type for representing entitites that carry
 * a `readonly .lineIndex: ILineIndex` property.
 */
export type IIndexCarrying = {
	readonly lineIndex: ILineIndex
}

/**
 * This is a type for representing a predicate that
 * determines whether the current stat of the given
 * `resource?: IOwnedStream<T>` is to be considered
 * a line break by the `IndexStream` stream.
 */
export type INewlinePredicate<T = any> = (resource?: IOwnedStream<T>) => boolean

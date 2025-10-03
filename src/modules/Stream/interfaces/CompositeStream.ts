import type { IArray } from "../../../interfaces.js"
import type {
	IControlStream,
	ILinkedStream,
	IOwnedStream
} from "./OwnedStream.js"

/**
 * This is a type of element of `IRawStreamArray`
 */ export type IRawStream = ILinkedStream | IStreamChooser

/**
 * This is a way to represent a chain of outputs
 * from an `IStreamChooser`.
 */
export type IRawStreamArray = IRawStream[]

/**
 * This is one of the two primary library types for
 * the building of `ICompositeStream`s. It represents
 * a variety of different options for altering the
 * parser's current structure to adapt to immidiate
 * input.
 *
 * It is a function that takes in an (optional)
 * `prevStrea?: IOwnedStream`, and produces an
 * `IStreamChoice` used to build the structure
 * on an `ILinkedStream`-by-`ILinkedStream` basis.
 */
export type IStreamChooser = (prevStream?: IOwnedStream) => IRawStreamArray

/**
 * This is an `IArray` of `IRawStream`s.
 * Used for a representation of a toplevel
 * overview of a new structure for an
 * `ILinkedStream`-based parser.
 */
export type IStreamArray = IArray<IRawStream>

/**
 * This is an `IConrolStream<T>`, which also
 * can be initialized via an `IOwnedStream`,
 * and is also in possession of:
 *
 * 1. `.renewResource(): boolean` method, which
 * verifies possibility of restructuring of
 * current recursive-`ILinkedStream` structure,
 * and, if possible, does so. Also used for
 * submitting changes to `.streams`. Returns
 * `true` if the renewal was successful (more
 * items for the underlying `IStream` structure
 * to handle), and `false` on failure (no more
 * items to handle).
 *
 * 2. `readonly .streams: IStreamArray` property,
 * which permits the user to modify the internals
 * of the `ICompositeStream` in question. More
 * specifically, the user is capable of performing
 * mutating method calls on `.streams`, while
 * retaining it as the same instance of `IStreamArray`.
 * They can replace the contents of `.streams` with
 * whatever they want, and then confirm the changes
 * via `.renewResource()`.
 *
 * Typically, of course, the user will not be needing
 * to call `.renewResource()` directly, however, it is
 * always good to have the possibility in case they
 * ever need to for whatever reason.
 */
export interface ICompositeStream<T = any> extends IControlStream<T> {
	renewResource(): boolean
	renewStream(stream: ILinkedStream): boolean
	readonly streams: IStreamArray
}

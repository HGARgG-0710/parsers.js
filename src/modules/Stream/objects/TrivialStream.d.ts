import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { DyssyncStream } from "./DyssyncStream.ts"

/**
 * This is a mixin that combines:
 *
 * 1. `OwnableStream`
 * 2. `IterableStream`
 * 3. `DyssyncStream`
 *
 * It is, in effect, the simplest possible `IOwnedStream` class.
 * Note that it is incomplete (there is no code for initializing `.curr`).
 * It has only one element, and ends the moment the user calls `.next()`.
 * It also always has `.isCurrEnd() === true`.
 */
export declare abstract class TrivialStream<T = any>
	extends DyssyncStream<T>
	implements IOwnedStream<T>, Iterable<T>
{
	readonly owner?: IOwningStream
	setOwner(newOwner: IOwningStream): void
	[Symbol.iterator](): Generator<T>

	isCurrEnd(): boolean
	next(): void
}

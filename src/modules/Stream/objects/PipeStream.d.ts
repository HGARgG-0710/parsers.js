import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { DelegateStream } from "./DelegateStream.ts"

/**
 * This is a (sealed) mixin that combines `IterableStream`,
 * `DelegateStream` and `OwnableStream` abstract classes.
 * It uses the constructor of `DelegateStream`.
 */
export declare abstract class PipeStream<T = any, Args extends any[] = []>
	extends DelegateStream<T, Args>
	implements IOwnedStream<T>, Iterable<T>
{
	setOwner(newOwner: IOwningStream<any, any[]>): void
	get owner(): IOwningStream | undefined
	[Symbol.iterator](): Generator<T>
}

import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { DelegateStream } from "./DelegateStream.ts"

/**
 * This is an abstract class, implementing `ILinkedStream<T>`.
 * It is a mixin of `PipeStream` and `SyncStream`, which is
 * to say, it completely and utterly delegates itself onto its
 * `.resource: IOwnedStream`. The purpose of such a class is
 * to allow for easy creation of `ILinkedStream`-classes with
 * very little unique functionality of their own, and which are
 * (however) independent enough to need their own constructor
 * (and, therefore, the copying method).
 *
 * It shares the constructor of `PipeStream`.
 *
 * For an example of an even less autonomous derivative of
 * `DelegateStream`, see `IdentityStream` [with a `.copy`
 * method implemented].
 */
export declare abstract class AttachedStream<T = any, Args extends any[] = []>
	extends DelegateStream<T, Args>
	implements Iterable<T>, IOwnedStream<T>
{
	readonly isEnd: boolean
	readonly curr: T
	readonly owner?: IOwningStream;
	[Symbol.iterator]: () => Generator<T>
	setOwner(newOwner: IOwningStream): void
}

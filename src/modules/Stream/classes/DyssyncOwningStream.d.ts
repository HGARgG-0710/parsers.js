import type { ICopiable } from "../../../interfaces.ts"
import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { PipeStream } from "./PipeStream.js"

/**
 * This is a class implementing `ILinkedStream<T>`.
 * It is a mixin of:
 *
 * 1. DyssyncStream
 * 2. PipeStream
 * 3. ResourceCopyingStream
 * 4. SyncCurrStream
 *
 * It has the constructor of `PipeStream`
 */
export declare abstract class DyssyncOwningStream<
		T = any,
		Args extends any[] = []
	>
	extends PipeStream<T, Args>
	implements ICopiable
{
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this

	protected set isEnd(isEnd: boolean)
	protected set curr(curr: T)

	get isEnd(): boolean
	get curr(): T

	protected syncCurr(): void
	protected endStream(): void
	protected startStream(): void

	copy(): this
}

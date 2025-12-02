import type { IOwnedStream } from "../../interfaces/OwnedStream.ts"
import type { PipeStream } from "./PipeStream.js"

/**
 * This is a class implementing `ILinkedStream<T>`.
 * It is a mixin of:
 *
 * 1. DyssyncStream
 * 2. PipeStream
 * 3. SyncCurrStream
 *
 * It has the constructor of `PipeStream`
 */
export declare abstract class DyssyncOwningStream<
	T = any,
	Args extends any[] = []
> extends PipeStream<T, Args> {
	protected ["constructor"]: new (resource?: IOwnedStream<T>) => this

	protected set isEnd(isEnd: boolean)
	protected set curr(curr: T)

	get isEnd(): boolean
	get curr(): T

	protected syncCurr(): void
	protected endStream(): void
	protected startStream(): void
}

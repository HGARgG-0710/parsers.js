import type { IOwnedStream, IOwningStream } from "../interfaces/OwnedStream.ts"
import type { BasicStream } from "./BasicStream.js"

/**
 * This is an abstract class that implements `ILinkedStream<T>`.
 * It is a mixin of:
 *
 * 1. `BasicStream`
 * 2. `OwningStream`
 * 3. `ResourceCopyingStream`
 * 4. `SyncCurrStream`
 *
 * It inherits the constructor of `BasicStream`.
 */
export declare abstract class BasicResourceStream<
		T = any,
		Args extends any[] = []
	>
	extends BasicStream<T, [IOwnedStream, ...(Args | [])]>
	implements IOwningStream<T>
{
	protected ["constructor"]: new (
		resource?: IOwnedStream,
		...args: Args | []
	) => this

	readonly resource?: IOwnedStream

	protected abstract baseNextIter(curr?: T): T
	protected syncCurr(): void
	setResource(newResource: IOwnedStream): void
	copy(): this
}

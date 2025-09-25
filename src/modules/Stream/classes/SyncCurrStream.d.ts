import type { IOwnedStream, IResourcefulStream } from "../../../interfaces.ts"

/**
 * This is a (sealed) mixin providing the `protected syncCurr(): void` method,
 * which sets `this.curr` to `this.resource.curr`.
 */
export declare abstract class SyncCurrStream<T = any>
	implements IResourcefulStream<T>
{
	abstract readonly curr: T
	abstract readonly isEnd: boolean
	abstract readonly resource?: IOwnedStream

	abstract next: () => void
	abstract isCurrEnd: () => boolean
	abstract setResource(newResource: IOwnedStream): void

	protected syncCurr(): void
}

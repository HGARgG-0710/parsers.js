import type { IOwnedStream, IResourcefulStream } from "../../../interfaces.ts"

/**
 * This is a (sealed) mixin that delegates the
 * `.curr`, `.isEnd` to its `.resource: IOwnedStream`
 * [which is to be provided by the using party].
 */
export declare abstract class SyncStream<T> implements IResourcefulStream<T> {
	abstract next(): void
	abstract isCurrEnd(): boolean
	readonly isEnd: boolean
	readonly curr: T

	abstract setResource(resource: IOwnedStream): void
	abstract readonly resource?: IOwnedStream
}

import type { IOwnedStream, IResourcefulStream } from "../../../interfaces.js"

/**
 * This is a (sealed) mixin that delegates the
 * `.curr`, `.isEnd` to its `.resource: IOwnedStream`
 * [which is to be provided by the using party].
 */
export abstract class SyncStream<T> implements IResourcefulStream<T> {
	abstract readonly resource?: IOwnedStream

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract setResource(resource: IOwnedStream): void

	get isEnd(): boolean {
		return this.resource!.isEnd
	}

	get curr(): T {
		return this.resource!.curr
	}
}

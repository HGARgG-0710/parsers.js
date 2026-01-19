import type {
	IOwnedStream,
	IResourcefulStream
} from "../../../../interfaces.js"

/**
 * This is a (sealed) mixin providing the `protected syncCurr(): void` method,
 * which sets `this.curr` to `this.resource.curr`.
 */
export abstract class SyncCurrStream<T = any> implements IResourcefulStream<T> {
	protected abstract set curr(newCurr: T)
	abstract get curr(): T
	abstract readonly isEnd: boolean
	abstract readonly resource: IOwnedStream | null

	abstract next(): void
	abstract isCurrEnd(): boolean
	abstract connectResource(resource: IOwnedStream): void
	abstract baseInit(): void

	protected syncCurr(): void {
		this.curr = this.resource!.curr
	}
}

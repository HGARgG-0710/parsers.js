import type { IFreeable, IOwnedStream } from "../../../../interfaces.js"
import { IdentityStream } from "./IdentityStream.js"

/**
 * This is a function for creation of factories for creation
 * of `ILinkedStream<T>` instances.
 * It is an extension of `IdentityStream<T, [IPoolGetter]>`.
 * It expects the underlying `resource` to return values of a
 * type `T extends IFreeable`. The stream in question returns
 * each and every item from the underlying stream,
 * calling `.free()` on it once the following `.next()` call
 * is made. Thus, it is intended for maximizing usage of
 * poolable objects. It is extremely useful when working
 * with "pure" (stateless) operations over a given `IOwnedStream<T>`
 * [id est - no state storage].
 */
export class FreeStream<T extends IFreeable = any> extends IdentityStream<
	T,
	[]
> {
	private freeable: T | null = null

	private enqueueCurrForFreeing() {
		this.freeable = this.curr
	}

	private freeEnqueued() {
		this.freeable!.free()
		this.freeable = null
	}

	free(): void {}

	setResource(resource: IOwnedStream) {
		super.setResource(resource)
		this.enqueueCurrForFreeing()
	}

	next() {
		this.freeEnqueued()
		super.next()
		this.enqueueCurrForFreeing()
	}
}

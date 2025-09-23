import type { IFreeable, IOwnedStream } from "../../../interfaces.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

function BuildFreeStream<T extends IFreeable = any>() {
	return class extends IdentityStream.generic!<T, []>() {
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
}

let freeStream: typeof IdentityStreamAnnotation | null = null

function PreFreeStream<
	T extends IFreeable = any
>(): typeof IdentityStreamAnnotation<T> {
	return freeStream
		? freeStream
		: (freeStream = BuildFreeStream<T>() as typeof IdentityStreamAnnotation)
}

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
export function FreeStream<T extends IFreeable = any>() {
	const freeStream = PreFreeStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new freeStream(resource)
	}
}

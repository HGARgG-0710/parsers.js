import type {
	IFreeable,
	IOwnedStream,
	IPoolGetter
} from "../../../interfaces.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

class FreeStreamAnnotation<T = any> extends IdentityStreamAnnotation<T> {
	setPoolGetter(poolGetter: IPoolGetter): this {
		return this
	}
}

function BuildFreeStream<T extends IFreeable = any>() {
	return class extends IdentityStream.generic!<T, []>() {
		private poolGetter: IPoolGetter
		private freeable: T | null = null

		private enqueueCurrForFreeing() {
			this.freeable = this.curr
		}

		private freeEnqueued() {
			this.freeable!.free(this.poolGetter)
			this.freeable = null
		}

		setResource(resource: IOwnedStream) {
			super.setResource(resource)
			this.enqueueCurrForFreeing()
		}

		setPoolGetter(poolGetter: IPoolGetter) {
			this.poolGetter = poolGetter
			return this
		}

		next() {
			this.freeEnqueued()
			super.next()
			this.enqueueCurrForFreeing()
		}
	} as typeof FreeStreamAnnotation<T>
}

let freeStream: typeof FreeStreamAnnotation | null = null

function PreFreeStream<
	T extends IFreeable = any
>(): typeof FreeStreamAnnotation<T> {
	return freeStream
		? freeStream
		: (freeStream = BuildFreeStream<T>() as typeof FreeStreamAnnotation)
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
export function FreeStream<T extends IFreeable = any>(poolGetter: IPoolGetter) {
	const freeStream = PreFreeStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new freeStream().setPoolGetter(poolGetter).init(resource)
	}
}

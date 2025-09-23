import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import type { IOwnedStream, IPushable, IStorage } from "../../../interfaces.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

class AccumulatorStreamAnnotation<T = any> extends IdentityStreamAnnotation<T> {
	static readonly pool: ObjectPool<
		AccumulatorStreamAnnotation,
		[IOwnedStream]
	>

	setStorage(storage: IPushable<T>) {
		return this
	}
}

function BuildAccumulatorStream<T = any>() {
	class AccumulatorStream extends IdentityStream.generic!<T>() {
		static readonly pool = Pools.Stream.add(
			new ObjectPool(AccumulatorStream)
		)

		private storage: IStorage<T>

		private pushCurr() {
			this.storage.push(this.curr)
		}

		protected get pool(): ObjectPool<AccumulatorStream, [IOwnedStream]> {
			return AccumulatorStream.pool
		}

		setStorage(storage: IStorage<T>) {
			this.storage = storage
			return this
		}

		next() {
			this.pushCurr()
			super.next()
		}

		copy() {
			return super.copy().setStorage(this.storage.copy())
		}
	}

	return AccumulatorStream
}

let accumulatorStream: typeof AccumulatorStreamAnnotation | null = null

function PreAccumulatorStream<T = any>() {
	return accumulatorStream
		? (accumulatorStream as typeof AccumulatorStreamAnnotation<T>)
		: (accumulatorStream =
				BuildAccumulatorStream<T>() as typeof AccumulatorStreamAnnotation)
}

/**
 * This is an `IStream` designed for accumulation of its
 * `.resource`-stream's elements into the provided `storage`
 * via the `storage.push(item)` operation.
 *
 * `storage` is used as-is, without any copying operation, so
 * as to permit the merging of results of multiple `IStream`s
 * into `storage`.
 */
export function AccumulatorStream<T = any>(storage: IStorage<T>) {
	const accumulatorStream = PreAccumulatorStream<T>()
	return function (stream?: IOwnedStream<T>) {
		return accumulatorStream.pool.create().setStorage(storage).init(stream)
	}
}

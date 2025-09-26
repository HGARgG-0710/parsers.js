import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import type {
	IAccumulatorStream,
	IOwnedStream,
	IStorage
} from "../../../interfaces.js"
import { IdentityStream } from "./IdentityStream.js"

class _AccumulatorStream<T = any> extends IdentityStream<T> {
	static readonly pool = Pools.Stream.add(new ObjectPool(_AccumulatorStream))

	private _storage: IStorage<T>

	private pushCurr() {
		this._storage.push(this.curr)
	}

	protected get pool(): ObjectPool<_AccumulatorStream, [IOwnedStream]> {
		return _AccumulatorStream.pool
	}

	get storage() {
		return this._storage
	}

	setStorage(storage: IStorage<T>) {
		this._storage = storage
		return this
	}

	next() {
		this.pushCurr()
		super.next()
	}

	copy() {
		return super.copy().setStorage(this._storage.copy())
	}
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
	return function (stream?: IOwnedStream<T>): IAccumulatorStream<T> {
		return _AccumulatorStream.pool.create().setStorage(storage).init(stream)
	}
}

export namespace AccumulatorStream {
	export const pool = _AccumulatorStream.pool
}

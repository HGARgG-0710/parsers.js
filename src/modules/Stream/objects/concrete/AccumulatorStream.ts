import { Pools } from "../../../../../main.js"
import type {
	IAccumulatorStream,
	IOwnedStream,
	IStorage
} from "../../../../interfaces.js"
import { ObjectPool } from "../../../../objects.js"
import { IdentityStream } from "./IdentityStream.js"

class _AccumulatorStream<T = any> extends IdentityStream<T> {
	static override readonly pool = Pools.Stream.add(
		new ObjectPool(_AccumulatorStream)
	)

	private _storage: IStorage<T>

	private pushCurr() {
		this._storage.push(this.curr)
	}

	protected override get pool() {
		return super.pool as ObjectPool<_AccumulatorStream, [IOwnedStream]>
	}

	get storage() {
		return this._storage
	}

	setStorage(storage: IStorage<T>) {
		this._storage = storage
		return this
	}

	override next() {
		this.pushCurr()
		super.next()
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

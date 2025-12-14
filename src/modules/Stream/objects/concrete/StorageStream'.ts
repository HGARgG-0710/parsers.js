import { Pools } from "../../../../../main.js"
import type {
	ICommonStream,
	IHandler,
	IOwnedStream
} from "../../../../interfaces/Stream.js"
import { ObjectPool } from "../../../../objects.js"
import type { IStorageStream } from "../../interfaces/StorageStream.js"
import { IdentityStream } from "./IdentityStream.js"

class _StorageStream<T = any, Stored = any>
	extends IdentityStream<T, []>
	implements IStorageStream<T, Stored>
{
	static readonly pool = Pools.Stream.add(new ObjectPool(_StorageStream))

	private handler: IHandler<T, Stored>
	private _currStored: Stored

	private set currStored(newCurrStored: Stored) {
		this._currStored = newCurrStored
	}

	private updateStored() {
		this.currStored = this.handler(this.resource!)
	}

	protected get pool() {
		return _StorageStream.pool
	}

	get currStored() {
		return this._currStored
	}

	baseInit(): void {
		this.updateStored()
	}

	next() {
		super.next()
		this.updateStored()
	}

	setHandler(handler: (stream?: IOwnedStream) => Stored) {
		this.handler = handler
		return this
	}
}

/**
 * This is a function for creation of factories for `IStorageStream<T, Storage>`
 * interface. The instances will call `handler`, with `this` being the instance
 * itself, and accept a `.resource: IOwnedStream<T>`. Based on the `.resource`,
 * it is intended that the `handler` shall return the new value for the
 * `readonly currStored: Stored` property of the  `IStorageStream<T, Stored>`
 * instance, upon each call to the `.next()` method.
 */
export function StorageStream<T = any, Stored = any>(
	handler: IHandler<T, Stored>
) {
	return function (
		resource?: IOwnedStream<T>
	): IStorageStream<T, Stored> & ICommonStream<T> {
		return _StorageStream.pool.create().setHandler(handler).init(resource)
	}
}

export namespace StorageStream {
	export const pool = _StorageStream.pool
}

import { Pools } from "../../../global.js"
import { ObjectPool } from "../../../objects.js"
import type { ICommonStream } from "../interfaces/CommonStream.js"
import type { IMarkerMaker, IMarkerStream } from "../interfaces/MarkerStream.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"
import { IdentityStream } from "./IdentityStream.js"

class _MarkerStream<T = any, M = any> extends IdentityStream<T> {
	static readonly pool = Pools.Stream.add(new ObjectPool(_MarkerStream))

	private _marker: M
	private markerMaker: IMarkerMaker<T, M>

	get marker() {
		return this._marker
	}

	setMarkerMaker(markerMaker: IMarkerMaker<T, M>) {
		this.markerMaker = markerMaker.bind(this)
		return this
	}

	setResource(resource: IOwnedStream): void {
		super.setResource(resource)
		this._marker = this.markerMaker(this)
	}
}

/**
 * This is a factory-function for `IMarkerStream<T, M> & ICommonStream<T>`
 * interface instances. It creates a stream with `.marker` field determined
 * by the result of calling `markerMaker` upon it.
 */
export function MarkerStream<T = any, M = any>(
	markerMaker: IMarkerMaker<T, M>
) {
	return function (
		resource?: IOwnedStream<T>
	): ICommonStream<T> & IMarkerStream<T, M> {
		return _MarkerStream.pool
			.create()
			.setMarkerMaker(markerMaker)
			.init(resource)
	}
}

export namespace MarkerStream {
	export const pool = _MarkerStream.pool
}

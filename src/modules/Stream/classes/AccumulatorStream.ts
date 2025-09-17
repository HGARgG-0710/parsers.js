import type { IOwnedStream, IPushable } from "../../../interfaces.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

class AccumulatorStreamAnnotation<T = any> extends IdentityStreamAnnotation<T> {
	setStorage(storage: IPushable<T>) {
		return this
	}
}

function BuildAccumulatorStream<T = any>() {
	return class extends IdentityStream.generic!<T>() {
		private storage: IPushable<T>

		private pushCurr() {
			this.storage.push(this.curr)
		}

		setStorage(storage: IPushable<T>) {
			this.storage = storage
			return this
		}

		next() {
			this.pushCurr()
			super.next()
		}
	}
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
export function AccumulatorStream<T = any>(storage: IPushable<T>) {
	const accumulatorStream = PreAccumulatorStream<T>()
	return function (stream?: IOwnedStream<T>) {
		return new accumulatorStream().setStorage(storage).init(stream)
	}
}

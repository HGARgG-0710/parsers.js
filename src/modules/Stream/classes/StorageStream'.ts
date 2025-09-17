import type { IHandler, IOwnedStream } from "../../../interfaces/Stream.js"
import type { IStorageStream } from "../interfaces/StorageStream.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

class StorageStreamAnnotation<
	T = any,
	Stored = any
> extends IdentityStreamAnnotation<T> {
	get currStored(): Stored {
		return null as Stored
	}

	setHandler(handler: IHandler<T, Stored>): this {
		return this
	}
}

function BuildStorageStream<T = any, Stored = any>() {
	return class
		extends IdentityStream.generic!<T, []>()
		implements IStorageStream<T, Stored>
	{
		private handler: IHandler<T, Stored>
		private _currStored: Stored

		private set currStored(newCurrMarked: Stored) {
			this._currStored = newCurrMarked
		}

		get currStored() {
			return this._currStored
		}

		private updateStored() {
			this.currStored = this.handler(this.resource!)
		}

		setResource(newResource: IOwnedStream): void {
			super.setResource(newResource)
			this.updateStored()
		}

		next() {
			super.next()
			this.updateStored()
		}

		prev() {
			super.prev()
			this.updateStored()
		}

		setHandler(handler: (stream?: IOwnedStream) => Stored) {
			this.handler = handler
			return this
		}

		copy() {
			return new this.constructor()
				.setHandler(this.handler)
				.init(this.resource)
		}
	} as unknown as typeof StorageStreamAnnotation<T, Stored>
}

let markerStream: typeof StorageStreamAnnotation | null = null

function PreMarkerStream<
	T = any,
	Marker = any
>(): typeof StorageStreamAnnotation<T, Marker> {
	return markerStream
		? markerStream
		: (markerStream = BuildStorageStream<
				T,
				Marker
		  >() as typeof StorageStreamAnnotation)
}

/**
 * This is a function for creation of factories for `IMarkerStream<T, Marker>`
 * interface. The instances will call `marker`, with `this` being the instance
 * itself, and accept a `.resource: IOwnedStream<T>`. Based on the `.resource`,
 * it is intended that the `marker` shall return the new value for the
 * `readonly currMarker: Marker` property of the  `IMarkerStream<T, Marker>`
 * instance, upon each call to the `.next()` method.
 */
export function StorageStream<T = any, Stored = any>(
	handler: (stream?: IOwnedStream) => Stored
) {
	const storageStream = PreMarkerStream<T, Stored>()
	return function (resource?: IOwnedStream<T>): IStorageStream<T, Stored> {
		return new storageStream().setHandler(handler).init(resource)
	}
}

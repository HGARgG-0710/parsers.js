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

		private set currStored(newCurrStored: Stored) {
			this._currStored = newCurrStored
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

let storageStream: typeof StorageStreamAnnotation | null = null

function PreStorageStream<
	T = any,
	Stored = any
>(): typeof StorageStreamAnnotation<T, Stored> {
	return storageStream
		? storageStream
		: (storageStream = BuildStorageStream<
				T,
				Stored
		  >() as typeof StorageStreamAnnotation)
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
	const storageStream = PreStorageStream<T, Stored>()
	return function (resource?: IOwnedStream<T>): IStorageStream<T, Stored> {
		return new storageStream().setHandler(handler).init(resource)
	}
}

import type { ILinkedStream, IOwnedStream } from "../../../interfaces/Stream.js"
import { ownerInitializer } from "../../Initializer/classes/OwnerInitializer.js"
import type { ISingletonHandler } from "../interfaces/SingletonStream.js"
import { TrivialStream } from "./TrivialStream.js"

class _SingletonStream<
	InType = any,
	OutType = any
> extends TrivialStream<OutType> {
	protected ["constructor"]: new (resource?: IOwnedStream<InType>) => this

	protected get initializer() {
		return ownerInitializer
	}

	private _resource?: IOwnedStream<InType>
	private handler: ISingletonHandler<InType, OutType>

	private set resource(newResource: IOwnedStream<InType> | undefined) {
		this._resource = newResource
	}

	get resource() {
		return this._resource
	}

	setResource(resource: IOwnedStream) {
		this.resource = resource
		this.curr = this.handler(resource)
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	setHandler(handler: ISingletonHandler<InType, OutType>) {
		this.handler = handler
		return this
	}
}

export function SingletonStream<InType = any, OutType = any>(
	handler: ISingletonHandler<InType, OutType>
) {
	return function (resource?: IOwnedStream<InType>): ILinkedStream<OutType> {
		return new _SingletonStream().setHandler(handler).init(resource)
	}
}

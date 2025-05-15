import type { ILinkedStream, IOwnedStream } from "../../interfaces/Stream.js"
import { maybeInit } from "../../utils.js"
import type { ISingletonHandler } from "../interfaces/SingletonStream.js"
import { SetterStream } from "./BasicStream.js"

class _SingletonStream<
	InType = any,
	OutType = any
> extends SetterStream<OutType> {
	["constructor"]: new (resource?: IOwnedStream<InType>) => this

	resource?: IOwnedStream<InType>
	private handler: ISingletonHandler<InType, OutType>

	protected baseNextIter(): void | OutType {}

	protected initGetter(): OutType {
		return this.handler(this.resource!)
	}

	isCurrEnd(): boolean {
		return true
	}

	setHandler(handler: ISingletonHandler<InType, OutType>) {
		this.handler = handler
		return this
	}

	constructor(resource?: IOwnedStream<InType>) {
		super(resource)
	}
}

export function SingletonStream<InType = any, OutType = any>(
	handler: ISingletonHandler<InType, OutType>
) {
	return function (resource?: IOwnedStream<InType>): ILinkedStream<OutType> {
		return maybeInit(new _SingletonStream().setHandler(handler), resource)
	}
}

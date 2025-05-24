import type { ILinkedStream, IOwnedStream } from "../../../interfaces/Stream.js"
import type { ISingletonHandler } from "../interfaces/SingletonStream.js"
import { SetterStream } from "./BasicStream.js"

class _SingletonStream<
	InType = any,
	OutType = any
> extends SetterStream<OutType> {
	protected ["constructor"]: new (resource?: IOwnedStream<InType>) => this

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
}

export function SingletonStream<InType = any, OutType = any>(
	handler: ISingletonHandler<InType, OutType>
) {
	return function (resource?: IOwnedStream<InType>): ILinkedStream<OutType> {
		return new _SingletonStream().setHandler(handler).init(resource)
	}
}

import type { IOwnedStream } from "../interfaces.js"
import type { ISingletonHandler } from "../interfaces/SingletonStream.js"
import { SetterStream } from "./BasicStream.js"

class _SingletonStream<
	InType = any,
	OutType = any
> extends SetterStream<OutType> {
	["constructor"]: new (resource?: IOwnedStream<InType>) => this

	handler: ISingletonHandler<InType, OutType>

	protected baseNextIter(): void | OutType {}

	protected initGetter(): OutType {
		return this.handler(this.resource!)
	}

	isCurrEnd(): boolean {
		return true
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	initHandler(handler: ISingletonHandler<InType, OutType>) {
		this.handler = handler
		return this
	}

	constructor(public resource?: IOwnedStream<InType>) {
		super(resource)
	}
}

const singletonStream = new _SingletonStream()

export function SingletonStream<InType = any, OutType = any>(
	handler: ISingletonHandler<InType, OutType>
) {
	return function (resource?: IOwnedStream<InType>): IOwnedStream<OutType> {
		return singletonStream.initHandler(handler).init(resource)
	}
}

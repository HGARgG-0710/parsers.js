import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IControlStream,
	IOwnedStream
} from "../../../interfaces/Stream.js"
import { ResourceStream } from "./BasicStream.js"

class _HandlerStream<
	InType = any,
	OutType = any
> extends ResourceStream<OutType> {
	protected ["constructor"]: new (resource?: IOwnedStream<InType>) => this

	private handler: (stream: IOwnedStream<InType>) => OutType

	state: Summat

	private handleCurr() {
		return this.handler(this.resource!)
	}

	protected baseNextIter(): OutType {
		let lastReceived: OutType | undefined
		do lastReceived = this.handleCurr()
		while (lastReceived === HandlerStream.SkippedItem)
		return lastReceived
	}

	protected initGetter() {
		return this.baseNextIter()
	}

	protected preInit() {
		if (this.resource) super.preInit()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd()
	}

	setState(state: Summat) {
		this.state = state
	}

	setHandler(handler: (stream: IOwnedStream<InType>) => OutType) {
		this.handler = handler
		return this
	}
}

export function HandlerStream<InType = any, OutType = any>(
	handler: (stream: IOwnedStream<InType>) => OutType
) {
	return function (resource?: IOwnedStream<InType>): IControlStream<OutType> {
		return new _HandlerStream().setHandler(handler).init(resource)
	}
}

export namespace HandlerStream {
	/**
	 * The value to be returned from the `.handler` on
	 * `StreamParser`, if the current item of the underlying
	 * `.value`-`Stream` is to be skipped
	 *
	 * When encountered during the `.next()` call, `StreamParser`
	 * will continue calling `.handler` until the return value of
	 * it differs from `SkippedItem`.
	 */
	export const SkippedItem = undefined
}

import type { Summat } from "@hgargg-0710/summat.ts"
import { Stream } from "../../constants.js"
import type { IControlStream, IOwnedStream } from "../../interfaces/Stream.js"
import { SetterStream } from "./BasicStream.js"
import { maybeInit } from "../../utils.js"

const { SkippedItem } = Stream.StreamParser

class _TransformStream<
	InType = any,
	OutType = any
> extends SetterStream<OutType> {
	protected ["constructor"]: new (resource?: IOwnedStream<InType>) => this

	private handler: (stream: IOwnedStream<InType>) => OutType

	state: Summat
	resource?: IOwnedStream<InType>

	private handleCurr() {
		return this.handler(this.resource!)
	}

	protected baseNextIter(): OutType {
		let lastReceived: OutType | undefined
		do lastReceived = this.handleCurr()
		while (lastReceived === SkippedItem)
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

	constructor(resource?: IOwnedStream<InType>) {
		super(resource)
	}
}

export function TransformStream<InType = any, OutType = any>(
	handler: (stream: IOwnedStream<InType>) => OutType
) {
	return function (resource?: IOwnedStream<InType>): IControlStream<OutType> {
		return maybeInit(new _TransformStream().setHandler(handler), resource)
	}
}

import type { Summat } from "@hgargg-0710/summat.ts"
import { Stream } from "../../constants.js"
import type { IControlStream, IOwnedStream } from "../../interfaces/Stream.js"
import { SetterStream } from "./BasicStream.js"

const { SkippedItem } = Stream.StreamParser

export function StreamParser<InType = any, OutType = any>(
	handler: (stream: IOwnedStream<InType>) => OutType
): new (resource?: IOwnedStream<InType>) => IControlStream<OutType> {
	return class extends SetterStream<OutType> {
		["constructor"]: new (resource?: IOwnedStream<InType>) => this

		state: Summat
		resource?: IOwnedStream<InType>

		private handleCurr() {
			return handler.call(this, this.resource!)
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

		constructor(resource?: IOwnedStream<InType>) {
			super(resource)
		}
	}
}

import { Stream } from "../../constants.js"
import type { IOwnedStream } from "../interfaces.js"
import type {
	IStreamParser,
	IUnderStreamParser
} from "../interfaces/StreamParser.js"
import { SetterStream } from "./BasicStream.js"

const { SkippedItem } = Stream.StreamParser

export function StreamParser<InType = any, OutType = any>(
	handler: (stream: IOwnedStream<InType>) => OutType
): new (resource?: IUnderStreamParser<InType>) => IStreamParser<OutType> {
	return class
		extends SetterStream<OutType>
		implements IOwnedStream<OutType>
	{
		["constructor"]: new (resource?: IUnderStreamParser<InType>) => this

		protected baseNextIter(): OutType {
			let lastReceived: OutType | undefined
			do lastReceived = handler(this.resource!)
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

		copy() {
			return new this.constructor(this.resource?.copy())
		}

		constructor(public resource?: IUnderStreamParser<InType>) {
			super(resource)
		}
	}
}

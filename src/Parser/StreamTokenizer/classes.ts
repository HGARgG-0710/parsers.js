import { StreamClass } from "../../Stream/StreamClass/classes.js"
import { streamTokenizerInitialize, streamTokenizerNext } from "./methods.js"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { StreamTokenizer } from "./interfaces.js"
import {
	underStreamDefaultIsEnd,
	underStreamIsEnd
} from "src/Stream/UnderStream/methods.js"
import type { EndableStream } from "src/Stream/StreamClass/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

export const StreamTokenizerBase = StreamClass({
	initGetter: streamTokenizerNext,
	isCurrEnd: underStreamIsEnd,
	baseNextIter: streamTokenizerNext,
	defaultIsEnd: underStreamDefaultIsEnd
})

const StreamTokenizerPrototype = {
	super: { value: StreamTokenizerBase.prototype },
	init: { value: streamTokenizerInitialize }
}

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	class streamTokenizerClass<InType = any>
		extends StreamTokenizerBase
		implements StreamTokenizer<InType, OutType>
	{
		input: EndableStream<InType>
		super: Summat
		tokenMap: StreamMap<OutType>

		init: (input?: EndableStream<InType>) => StreamTokenizer<InType, OutType>

		constructor(input?: EndableStream<InType>) {
			super()
			this.init(input)
		}
	}

	Object.defineProperties(streamTokenizerClass.prototype, StreamTokenizerPrototype)
	streamTokenizerClass.prototype.tokenMap = tokenMap

	return streamTokenizerClass
}

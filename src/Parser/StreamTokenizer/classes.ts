import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { StreamTokenizer } from "./interfaces.js"
import type { EndableStream } from "../../Stream/StreamClass/interfaces.js"

import { streamTokenizerInitialize, streamTokenizerNext } from "./methods.js"
import {
	inputDefaultIsEnd,
	inputIsEnd
} from "src/Stream/StreamClass/methods.js"

import { StreamClass } from "../../Stream/StreamClass/classes.js"

const StreamTokenizerBase = StreamClass({
	initGetter: streamTokenizerNext,
	isCurrEnd: inputIsEnd,
	baseNextIter: streamTokenizerNext,
	defaultIsEnd: inputDefaultIsEnd
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

import { StreamClass } from "../../Stream/StreamClass/classes.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import { streamTokenizerNext } from "./methods.js"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { StreamTokenizer } from "./interfaces.js"
import {
	underStreamDefaultIsEnd,
	underStreamIsEnd
} from "src/Stream/UnderStream/methods.js"
import { Inputted } from "src/Stream/UnderStream/classes.js"
import { streamIterator } from "src/Stream/IterableStream/methods.js"

export const StreamTokenizerClass = StreamClass({
	initGetter: streamTokenizerNext,
	isCurrEnd: underStreamIsEnd,
	baseNextIter: streamTokenizerNext,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function <InType = any>(input: BasicStream<InType>): StreamTokenizer<OutType> {
		const result = Inputted(StreamTokenizerClass(), input)
		result.tokenMap = tokenMap
		result[Symbol.iterator] = streamIterator<OutType>
		return result as StreamTokenizer<OutType>
	}
}

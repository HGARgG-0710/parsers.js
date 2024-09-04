import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../../Stream/IterationHandler/classes.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import { streamTokenizerNext } from "../../Stream/BasicStream/methods.js"
import {
	streamTokenizerIsEnd,
	streamTokenizerCurrGetter
} from "src/Stream/PreBasicStream/methods.js"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { StreamTokenizer } from "./interfaces.js"
import { streamTokenizerCurrentCondition } from "./methods.js"

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function (input: BasicStream): StreamTokenizer<OutType> {
		return ForwardStreamIterationHandler(
			StreamCurrGetter<OutType>(
				{
					tokenMap,
					input,
					next: streamTokenizerNext<OutType>,
					isStart: true
				},
				streamTokenizerCurrGetter<OutType>,
				streamTokenizerCurrentCondition<OutType>
			),
			streamTokenizerNext<OutType>,
			streamTokenizerIsEnd<OutType>
		) as StreamTokenizer<OutType>
	}
}

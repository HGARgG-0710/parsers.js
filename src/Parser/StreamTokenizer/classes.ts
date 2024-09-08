import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../../Stream/StreamClass/classes.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import { streamTokenizerNext } from "./methods.js"
import type { StreamMap } from "../ParserMap/interfaces.js"
import type { StreamTokenizer } from "./interfaces.js"
import { underStreamIsEnd } from "src/Stream/UnderStream/methods.js"

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function (input: BasicStream): StreamTokenizer<OutType> {
		return ForwardStreamIterationHandler<OutType>(
			StreamCurrGetter<OutType>(
				{
					tokenMap,
					input
				},
				undefined,
				streamTokenizerNext<OutType>
			),
			streamTokenizerNext<OutType>,
			underStreamIsEnd<OutType>
		) as StreamTokenizer<OutType>
	}
}

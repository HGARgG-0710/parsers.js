import { type BasicStream, streamTokenizerIsEnd } from "../types/Stream/BasicStream.js"
import type { Inputted } from "src/interfaces/Inputted.js"
import type { StreamMap } from "./ParserMap.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../types/Stream/StreamIterationHandler.js"
import type { StartedStream } from "main.js"

import { streamTokenizerCurrGetter } from "src/types/Stream/PreBasicStream.js"
import { streamTokenizerNext } from "src/types/Stream/BasicStream.js"
import type { BaseNextable } from "src/interfaces/BaseIterable.js"
import type { IsEndCurrable } from "src/interfaces/BoundCheckable.js"

export interface StreamTokenizer<OutType = any>
	extends Inputted<BasicStream>,
		StartedStream<OutType>,
		BaseNextable<OutType>,
		IsEndCurrable {
	tokenMap: StreamMap<OutType>
}

export function streamTokenizerCurrentCondition<Type = any>(this: StreamTokenizer<Type>) {
	return !this.isStart
}

export function StreamTokenizer<OutType = any>(tokenMap: StreamMap<OutType>) {
	return function (input: BasicStream): StreamTokenizer<OutType> {
		return ForwardStreamIterationHandler(
			StreamCurrGetter(
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

import type { ParserMap, ParsingPredicate, ParserFunction } from "./ParserMap.js"
import type { BasicStream } from "src/types/Stream/BasicStream.js"
import type { Collection } from "../types/Collection.js"
import type { Resulting } from "src/misc.js"

export interface ParsingState<
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> extends Resulting<ResultType> {
	streams?: StreamType[]
	state?: object
	parser?:
		| ParserMap<any, any, StreamType, ResultType, TempType>
		| ParserFunction<any, StreamType, ResultType, TempType>
	finished?: ParsingPredicate<StreamType, ResultType, TempType>
	change?: (x: ResultType, y: TempType) => void
}

export function GeneralParser<
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
>(initState?: ParsingState<StreamType, ResultType, TempType>) {
	return function (state: ParsingState<StreamType, ResultType, TempType>) {
		if (initState) state = { ...initState, ...state }
		while (!state.finished(state)) state.change(state.result, state.parser(state))
		return state
	}
}

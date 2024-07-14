import type { BasicStream, ParserFunction, ParserMap, ParsingPredicate } from "main.js"
import type { Collection } from "src/types/Collection.js"

export interface ParsingState<
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> {
	streams?: StreamType[]
	state?: object
	parser?:
		| ParserMap<any, any, StreamType, ResultType, TempType>
		| ParserFunction<any, StreamType, ResultType, TempType>
	result?: ResultType
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

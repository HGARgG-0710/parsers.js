import type { BasicStream, ParserFunction, ParserMap, ParsingPredicate } from "main.js"
import type { Collection } from "src/types/Collection.js"

export interface ParsingState<StreamType = BasicStream, ResultType = Collection> {
	streams: StreamType[]
	state: object
	parser: ParserMap | ParserFunction
	result: ResultType
	finished: ParsingPredicate
	change: (x: ResultType, ...y: any) => ResultType
}

export function GeneralParser(initState?: ParsingState) {
	return function (state: ParsingState) {
		if (initState) state = { ...initState, ...state }
		let i = 0
		while (!state.finished(state, i)) {
			state.change(state.result, ...state.parser(state))
			++i
		}
		return state
	}
}

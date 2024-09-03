import type { ParserMap, ParserFunction } from "./ParserMap.js"
import type { BasicStream } from "../types/Stream/BasicStream.js"
import type { Collection } from "../types/Collection.js"
import type { Resulting } from "src/interfaces/Resulting.js"

export interface ParsingState<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType,
	KeyType = any
> extends Resulting<ResultType> {
	streams?: StreamType[]
	state?: object
	parser?:
		| ParserMap<
				KeyType,
				TempType,
				ParsingState<StreamType, ResultType, TempType, KeyType>
		  >
		| ParserFunction<
				ParsingState<StreamType, ResultType, TempType, KeyType>,
				TempType
		  >
	finished?: boolean
	change?: (x: TempType) => void
}

export type BaseParsingState = ParsingState<BasicStream, any, any, any>
export type BaseMapParsingState<KeyType = any> = ParsingState<
	BasicStream,
	any,
	any,
	KeyType
>
export type DefaultMapParsingState<KeyType = any> = ParsingState<
	BasicStream,
	Collection,
	Collection,
	KeyType
>

export function GeneralParser<T extends BaseParsingState>(initState?: T) {
	return function (state: T) {
		if (initState) state = { ...initState, ...state }
		while (!state.finished) state.change(state.parser(state))
		return state
	}
}

export function DefineFinished<T extends BaseParsingState = ParsingState>(
	x: T,
	finished: () => boolean
) {
	return Object.defineProperty(x, "finished", {
		get: finished
	})
}

export const firstFinished = function <T extends BaseParsingState = ParsingState>(
	this: T
) {
	return this.streams[0].isEnd
}

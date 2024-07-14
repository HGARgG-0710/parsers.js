import type { Collection } from "src/types/Collection.js"
import type { Summat } from "../types.js"
import type { IndexMap } from "../types/IndexMap.js"
import type { BasicStream } from "../types/Stream.js"
import type { ParsingState } from "./GeneralParser.js"

export type ParserMap<
	KeyType = any,
	OutType = any,
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> = ParserFunction<OutType, StreamType, ResultType, TempType> & {
	table: IndexMap<KeyType, ParserFunction<OutType>>
}

export type ParserFunction<
	OutType = any,
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> = (
	| ((state?: ParsingState<StreamType, ResultType, TempType>) => OutType)
	| (() => OutType)
) &
	Summat

export interface StreamHandler<Type = any[]> extends Summat {
	(input?: BasicStream, i?: number): Type
}

export interface DelimHandler<Type = any[]> extends Summat {
	(input?: BasicStream, i?: number, j?: number): Type
}

export function ParserMap<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, ParserFunction<OutType>>
): ParserMap<KeyType, OutType> {
	const T = function (x: ParsingState) {
		return T.table.index(x)(x)
	}
	T.table = indexMap
	return T
}

export type ParsingPredicate<
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> = ParserFunction<boolean, StreamType, ResultType, TempType>

export type StreamPredicate = StreamHandler<boolean>
export type DelimPredicate = DelimHandler<boolean>

export function table<KeyType = any, OutType = any>(
	parserMap: ParserMap<KeyType, OutType>
): [KeyType[], ParserFunction<OutType>[]] {
	return [parserMap.keys, parserMap.values]
}

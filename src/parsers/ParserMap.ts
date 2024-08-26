import type { Collection } from "../types/Collection.js"
import type { Summat, SummatFunction } from "../types/Summat.js"
import type { IndexMap } from "../types/IndexMap.js"
import type { BasicStream } from "src/types/Stream/BasicStream.js"
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
	| ((
			state?: ParsingState<StreamType, ResultType, TempType>,
			parser?: Function
	  ) => OutType)
	| ((state?: ParsingState<StreamType, ResultType, TempType>) => OutType)
	| (() => OutType)
) &
	Summat

export type StreamMap<
	OutType = any,
	StreamType extends BasicStream = BasicStream
> = StreamHandler<SummatFunction<any, StreamType, OutType>>

export type StreamHandler<Type = any[]> = Summat &
	(
		| ((input?: BasicStream, i?: number) => Type)
		| ((input?: BasicStream) => Type)
		| (() => Type)
	)

export type DelimHandler<Type = any[]> = Summat &
	(((input?: BasicStream, i?: number, j?: number) => Type) | StreamHandler<Type>)

export function ParserMap<KeyType = any, OutType = any>(
	indexMap: IndexMap<KeyType, ParserFunction<OutType>>
): ParserMap<KeyType, OutType> {
	const T = (x: ParsingState) => T.table.index(x)(x, T)
	T.table = indexMap
	return T
}

export type ParsingPredicate<
	StreamType = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> = ParserFunction<boolean, StreamType, ResultType, TempType>

export type DelimPredicate = DelimHandler<boolean>

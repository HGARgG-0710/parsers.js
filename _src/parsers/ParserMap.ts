import type { Collection } from "../types/Collection.js"
import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import type { IndexMap } from "../types/IndexMap.js"
import type { BasicStream } from "../types/Stream/BasicStream.js"
import type {
	DefaultMapParsingState,
	BaseParsingState,
	ParsingState,
	BaseMapParsingState
} from "./GeneralParser.js"

export type ParserMap<
	KeyType = any,
	OutType = any,
	T extends BaseMapParsingState<KeyType> = DefaultMapParsingState<KeyType>
> = ParserFunction<T, OutType> & {
	table?: IndexMap<KeyType, ParserFunction<T, OutType>>
}

export type ParserFunction<T extends BaseParsingState = ParsingState, OutType = any> = ((
	state?: T,
	parser?: Function
) => OutType) &
	Summat

export type StreamMap<
	OutType = any,
	StreamType extends BasicStream = BasicStream
> = StreamHandler<SummatFunction<any, StreamType, OutType>>

export type StreamHandler<Type = any[]> = StreamTransform<any, Type>

export type StreamTransform<UnderType = any, UpperType = any> = Summat &
	((input?: BasicStream<UnderType>, i?: number) => UpperType)

export type DelimHandler<Type = any[]> = Summat &
	((input?: BasicStream, i?: number, j?: number) => Type)

export function ParserMap<
	KeyType = any,
	OutType = any,
	ParsingType extends BaseMapParsingState<KeyType> = DefaultMapParsingState<KeyType>
>(
	indexMap: IndexMap<KeyType, ParserFunction<ParsingType, OutType>>
): ParserMap<KeyType, OutType, ParsingType> {
	const T = (x: ParsingType) => T.table.index(x)(x, T)
	T.table = indexMap
	return T
}

export type ParsingPredicate<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType,
	KeyType = any
> = ((
	state?: ParsingState<StreamType, ResultType, TempType, KeyType>,
	parser?: Function
) => boolean) &
	Summat

export type DelimPredicate = DelimHandler<boolean>

import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { IndexMap } from "src/IndexMap/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type {
	BaseMapParsingState,
	DefaultMapParsingState,
	BaseParsingState
} from "../interfaces.js"

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

import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "src/Stream/interfaces.js"
import type { Indexable } from "src/IndexMap/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type {
	BaseMapParsingState,
	DefaultMapParsingState,
	BaseParsingState
} from "../interfaces.js"

export type ParserMap<
	OutType = any,
	T extends BaseMapParsingState = DefaultMapParsingState
> = ParserFunction<T, OutType> & {
	table?: Indexable<ParserFunction<T, OutType>>
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

export type ParsingPredicate<
	StreamType extends BasicStream = BasicStream,
	ResultType = Collection,
	TempType = ResultType
> = ((
	state?: ParsingState<StreamType, ResultType, TempType>,
	parser?: Function
) => boolean) &
	Summat

export type StreamPredicate = StreamHandler<boolean>

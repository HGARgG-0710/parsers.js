import type { Summat } from "@hgargg-0710/summat.ts"

import type { BasicStream } from "../../Stream/interfaces.js"
import type { Collection } from "../../Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type ParserFunction<InputType = any, OutType = any> = ((
	state?: InputType,
	parser?: Function
) => OutType) &
	Summat

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

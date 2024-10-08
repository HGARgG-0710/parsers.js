import type { Position } from "../../Stream/PositionalStream/Position/interfaces.js"
import type { Collection } from "../../Pattern/Collection/interfaces.js"
import type { ReversibleStream } from "../../Stream/ReversibleStream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type SkipType<Type> = [Position, Type]

export type SkipState<OutType = any> = ParsingState<
	ReversibleStream,
	Collection<OutType>,
	SkipType<Iterable<OutType>>
>

export type FixedSkipState<OutType = any> = ParsingState<
	ReversibleStream,
	Collection,
	Iterable<OutType>
>

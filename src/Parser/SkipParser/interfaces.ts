import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type SkipType<Type> = [Position, Type]

export type SkipState<KeyType = any, OutType = any> = ParsingState<
	ReversibleStream,
	Collection<OutType>,
	SkipType<Iterable<OutType>>,
	KeyType
>

export type FixedSkipState<KeyType = any, OutType = any> = ParsingState<
	ReversibleStream,
	Collection,
	Iterable<OutType>,
	KeyType
>

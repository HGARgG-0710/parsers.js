import type { BasicStream } from "_src/types.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "./GeneralParser/interfaces.js"

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

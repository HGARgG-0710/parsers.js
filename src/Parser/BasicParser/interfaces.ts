import type { BasicStream } from "_src/types.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type BasicState<KeyType = any, OutType = any> = ParsingState<
	BasicStream,
	Collection<OutType>,
	Iterable<OutType>,
	KeyType
>

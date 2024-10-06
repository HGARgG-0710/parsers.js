import type { BasicStream } from "src/Stream/interfaces.js"
import type { Collection } from "src/Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type BasicState<OutType = any> = ParsingState<
	BasicStream,
	Collection<OutType>,
	Iterable<OutType>
>

import type { BasicStream } from "../../Stream/interfaces.js"
import type { Collection } from "../../Pattern/Collection/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"

export type BasicState<OutType = any> = ParsingState<
	BasicStream,
	Collection<OutType>,
	Iterable<OutType>
>

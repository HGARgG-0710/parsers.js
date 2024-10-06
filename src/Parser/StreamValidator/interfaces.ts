import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { StreamPredicate } from "../ParserMap/interfaces.js"
import type { BasicStream } from "src/Stream/interfaces.js"

export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamPredicate
>

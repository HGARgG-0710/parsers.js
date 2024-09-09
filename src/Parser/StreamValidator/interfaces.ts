import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { StreamHandler, StreamPredicate } from "../ParserMap/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"

export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamPredicate,
	KeyType
>

import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { StreamHandler } from "../ParserMap/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"

export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamHandler<boolean>,
	KeyType
>

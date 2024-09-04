import type { BasicStream } from "_src/types.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { StreamHandler } from "../ParserMap/interfaces.js"

export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamHandler<boolean>,
	KeyType
>

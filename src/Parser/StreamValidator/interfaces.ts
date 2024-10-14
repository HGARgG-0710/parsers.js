import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { StreamPredicate } from "../TableMap/interfaces.js"
import type { BasicStream } from "../../Stream/interfaces.js"

export type StreamValidatorState<KeyType = any> = ParsingState<
	BasicStream<KeyType>,
	boolean,
	StreamPredicate
>

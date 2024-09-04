import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { LocatorOutput } from "../StreamLocator/interfaces.js"
import type { PositionalStream } from "src/Stream/PositionalStream/interfaces.js"

export type PositionalValidatorState<KeyType = any> = ParsingState<
	PositionalStream,
	LocatorOutput,
	boolean,
	KeyType
>

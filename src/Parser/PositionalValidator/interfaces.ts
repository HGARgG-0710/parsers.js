import type { PositionalStream } from "_src/types.js";
import type { LocatorOutput } from "_src/validate.js";
import type { ParsingState } from "../GeneralParser/interfaces.js";


export type PositionalValidatorState<KeyType = any> = ParsingState<
	PositionalStream, LocatorOutput, boolean, KeyType
>

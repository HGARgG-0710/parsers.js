import type { BasicStream } from "src/Stream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { LocatorOutput } from "../StreamLocator/interfaces.js"
import type { Posed } from "src/Stream/PositionalStream/interfaces.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"

export type PositionalValidatorState = ParsingState<
	BasicStream & Posed<Position>,
	LocatorOutput,
	boolean
>

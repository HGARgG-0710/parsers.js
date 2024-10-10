import type { BasicStream } from "../../Stream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { LocatorOutput } from "../StreamLocator/interfaces.js"
import type { Posed, Position } from "../../Position/interfaces.js"

export type PositionalValidatorState = ParsingState<
	BasicStream & Posed<Position>,
	LocatorOutput,
	boolean
>

import type { Posed } from "src/Stream/PositionalStream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { Position } from "../../Stream/PositionalStream/Position/interfaces.js"
import type { BasicStream } from "src/Stream/interfaces.js"

export type LocatorOutput = [boolean, Position]
export type LocatorState = ParsingState<
	BasicStream & Posed<Position>,
	LocatorOutput,
	boolean
>

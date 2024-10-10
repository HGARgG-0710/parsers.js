import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { Position, Posed } from "../../Position/interfaces.js"
import type { BasicStream } from "../../Stream/interfaces.js"

export type LocatorOutput = [boolean, Position]
export type LocatorState = ParsingState<
	BasicStream & Posed<Position>,
	LocatorOutput,
	boolean
>

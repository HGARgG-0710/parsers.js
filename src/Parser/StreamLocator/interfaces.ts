import type { PositionalStream } from "src/Stream/PositionalStream/interfaces.js"
import type { ParsingState } from "../GeneralParser/interfaces.js"
import type { Position } from "../../Stream/PositionalStream/Position/interfaces.js"

export type LocatorOutput = [boolean, Position]

export type LocatorState<KeyType = any> = ParsingState<
	PositionalStream,
	LocatorOutput,
	boolean,
	KeyType
>

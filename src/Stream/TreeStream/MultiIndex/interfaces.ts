import type { Slicer } from "./Slicer/interfaces.js"
import type { MultiIndexModifier } from "./MultiIndexModifier/interfaces.js"
import type { PositionObject } from "src/Stream/PositionalStream/Position/interfaces.js"

export interface MultiIndex extends PositionObject<number[]> {
	slicer: Slicer<number[]>
	modifier: MultiIndexModifier
	equals(position: MultiIndex): boolean
	slice(from?: number, to?: number): Slicer<number[]>
	firstLevel(): number[]
	lastLevel(): number[]
}

export * as MultiIndexModifier from "./MultiIndexModifier/interfaces.js"

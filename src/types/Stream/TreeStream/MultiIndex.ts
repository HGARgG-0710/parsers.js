import type { PositionObject } from "../Position.js"
import { Slicer } from "../../Slicer.js"

import type { MultiIndexModifier } from "./MultiIndex/MultiIndexModifier.js"

export interface MultiIndex extends PositionObject<number[]> {
	slicer: Slicer<number[]>
	modifier: MultiIndexModifier
	equals(position: MultiIndex): boolean
	slice(from?: number, to?: number): Slicer<number[]>
	firstLevel(): number[]
	lastLevel(): number[]
}

export * from "./MultiIndex/MultiIndex.js"
export * from "./MultiIndex/MultiIndexModifier.js"

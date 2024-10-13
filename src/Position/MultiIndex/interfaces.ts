import type { MultiIndexModifier } from "./MultiIndexModifier/interfaces.js"
import type { PositionObject } from "../interfaces.js"

export interface MultiIndex extends PositionObject<number[]> {
	modifier: MultiIndexModifier
	equals: (position: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex
}

export * as MultiIndexModifier from "./MultiIndexModifier/interfaces.js"

import type { PositionObject } from "../interfaces.js"

export interface MultiIndex extends PositionObject<number[]> {
	levels: number
	equals: (position: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex
}

export type * as MultiIndexModifier from "./MultiIndexModifier/interfaces.js"

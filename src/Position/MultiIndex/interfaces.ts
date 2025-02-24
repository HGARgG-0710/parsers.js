import type { PositionObject } from "../interfaces.js"

export interface MultiIndex extends PositionObject {
	levels: number
	get(): readonly number[]
	equals: (position: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex
}

export interface MultiIndexModifier {
	init: (multind?: MultiIndex) => void
	get: () => MultiIndex
	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: (length: number) => MultiIndex
	clear: () => MultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => void
}

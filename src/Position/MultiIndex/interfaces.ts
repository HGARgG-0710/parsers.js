import type { PositionObject } from "../interfaces.js"

export interface IMultiIndex extends PositionObject {
	levels: number
	get(): readonly number[]
	equals: (position: IMultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => IMultiIndex
}

export interface IMultiIndexModifier {
	init: (multind?: IMultiIndex) => void
	get: () => IMultiIndex
	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: (length: number) => IMultiIndex
	clear: () => IMultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => void
}

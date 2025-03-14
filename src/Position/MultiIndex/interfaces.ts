import type { GettablePattern } from "../../Pattern/interfaces.js"
import type { PositionObject } from "../interfaces.js"

export interface IMultiIndex extends PositionObject, GettablePattern<readonly number[]> {
	levels: number
	equals: (position: IMultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => IMultiIndex
}

export interface IMultiIndexModifier extends GettablePattern<IMultiIndex> {
	init: (multind?: IMultiIndex) => void
	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: (length: number) => IMultiIndex
	clear: () => IMultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => void
}

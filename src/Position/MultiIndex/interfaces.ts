import type { ICopiable } from "../../interfaces.js"
import type { IGettablePattern } from "../../Pattern/interfaces.js"
import type { IPositionObject } from "../interfaces.js"

export interface IMultiIndex
	extends IPositionObject<number[]>,
		IGettablePattern<readonly number[]>,
		ICopiable {
	levels: number
	equals: (position: IMultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	firstLevel: () => number[]
	lastLevel: () => number[]
}

export interface IMultiIndexModifier
	extends IGettablePattern<IMultiIndex>,
		ICopiable {
	init: (multind?: IMultiIndex) => void
	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: (length: number) => IMultiIndex
	clear: () => IMultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => void
}

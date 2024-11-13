import type { Pattern } from "../../../Pattern/interfaces.js"
import type { MultiIndex } from "../interfaces.js"

export interface MultiIndexModifier extends Pattern<MultiIndex> {
	init: (multind: MultiIndex) => MultiIndexModifier
	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: (length: number) => MultiIndex
	clear: () => MultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => void
}

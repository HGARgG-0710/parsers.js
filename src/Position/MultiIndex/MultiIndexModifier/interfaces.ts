import type { MultiIndex } from "../interfaces.js"
import type { Pattern } from "src/Pattern/interfaces.js"

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

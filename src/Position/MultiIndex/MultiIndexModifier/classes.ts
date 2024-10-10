import type { MultiIndex } from "../interfaces.js"
import type { MultiIndexModifier as MultiIndexModifierType } from "./interfaces.js"
import {
	multiIndexModifierNextLevel,
	multiIndexModifierPrevLevel,
	multiIndexModifierResize,
	multiIndexModifierClear,
	multiIndexModifierIncLast,
	multiIndexModifierDecLast,
	multiIndexModifierExtend
} from "./methods.js"

export class MultiIndexModifier implements MultiIndexModifierType {
	multind: MultiIndex

	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: () => MultiIndex
	clear: () => MultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => number

	constructor(multind: MultiIndex) {
		this.multind = multind
	}
}

Object.defineProperties(MultiIndexModifier.prototype, {
	nextLevel: { value: multiIndexModifierNextLevel },
	prevLevel: { value: multiIndexModifierPrevLevel },
	resize: { value: multiIndexModifierResize },
	clear: { value: multiIndexModifierClear },
	incLast: { value: multiIndexModifierIncLast },
	decLast: { value: multiIndexModifierDecLast },
	extend: { value: multiIndexModifierExtend }
})

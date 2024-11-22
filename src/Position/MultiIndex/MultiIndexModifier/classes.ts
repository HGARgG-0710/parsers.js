import type { MultiIndex } from "../interfaces.js"
import type { MultiIndexModifier as MultiIndexModifierType } from "./interfaces.js"
import {
	multiIndexModifierNextLevel,
	multiIndexModifierPrevLevel,
	multiIndexModifierResize,
	multiIndexModifierClear,
	multiIndexModifierIncLast,
	multiIndexModifierDecLast,
	multiIndexModifierExtend,
	multiIndexModifierInitialize
} from "./methods.js"

import { BasicPattern } from "../../../Pattern/classes.js"
import { extendClass } from "../../../utils.js"

export class MultiIndexModifier
	extends BasicPattern<MultiIndex>
	implements MultiIndexModifierType
{
	init: (multind: MultiIndex) => MultiIndexModifierType

	nextLevel: () => number[]
	prevLevel: () => number[]
	resize: () => MultiIndex
	clear: () => MultiIndex
	incLast: () => number
	decLast: () => number
	extend: (subIndex: number[]) => number

	constructor(value: MultiIndex) {
		super(value)
	}
}

extendClass(MultiIndexModifier, {
	init: { value: multiIndexModifierInitialize },
	nextLevel: { value: multiIndexModifierNextLevel },
	prevLevel: { value: multiIndexModifierPrevLevel },
	resize: { value: multiIndexModifierResize },
	clear: { value: multiIndexModifierClear },
	incLast: { value: multiIndexModifierIncLast },
	decLast: { value: multiIndexModifierDecLast },
	extend: { value: multiIndexModifierExtend }
})

import type { BasicTreeStream } from "../../Stream/TreeStream/interfaces.js"
import type { MultiIndexModifier as MultiIndexModifierType } from "./MultiIndexModifier/interfaces.js"
import type { MultiIndex as MultiIndexType } from "./interfaces.js"

import {
	multiIndexConvert,
	multiIndexCompare,
	multiIndexEqual,
	multiIndexCopy,
	multiIndexSlice,
	multiIndexFirstLevel,
	multiIndexLastLevel
} from "./methods.js"

import { MultiIndexModifier } from "./MultiIndexModifier/classes.js"

export class MultiIndex implements MultiIndexType {
	value: number[]
	modifier: MultiIndexModifierType

	equals: (x: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	convert: (stream: BasicTreeStream) => number
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex

	constructor(multindex: number[]) {
		this.value = multindex
		this.modifier = new MultiIndexModifier(this)
	}
}

Object.defineProperties(MultiIndex.prototype, {
	convert: { value: multiIndexConvert },
	compare: { value: multiIndexCompare },
	equals: { value: multiIndexEqual },
	copy: { value: multiIndexCopy },
	slice: { value: multiIndexSlice },
	firstLevel: { value: multiIndexFirstLevel },
	lastLevel: { value: multiIndexLastLevel }
})

export * as MultiIndexModifier from "./MultiIndexModifier/classes.js"

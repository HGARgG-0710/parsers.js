import type { BasicTreeStream } from "../../Stream/TreeStream/interfaces.js"
import type { MultiIndex as MultiIndexType } from "./interfaces.js"

import {
	multiIndexConvert,
	multiIndexCompare,
	multiIndexEqual,
	multiIndexCopy,
	multiIndexSlice,
	multiIndexFirstLevel,
	multiIndexLastLevel,
	multiIndexLevelsGetter,
	multiIndexLevelsSetter
} from "./methods.js"

export class MultiIndex implements MultiIndexType {
	value: number[]
	levels: number

	equals: (x: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	convert: (stream: BasicTreeStream) => number
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex

	constructor(multindex: number[] = []) {
		this.value = multindex
	}
}

Object.defineProperties(MultiIndex.prototype, {
	levels: { get: multiIndexLevelsGetter, set: multiIndexLevelsSetter },
	convert: { value: multiIndexConvert },
	compare: { value: multiIndexCompare },
	equals: { value: multiIndexEqual },
	copy: { value: multiIndexCopy },
	slice: { value: multiIndexSlice },
	firstLevel: { value: multiIndexFirstLevel },
	lastLevel: { value: multiIndexLastLevel }
})

export * as MultiIndexModifier from "./MultiIndexModifier/classes.js"

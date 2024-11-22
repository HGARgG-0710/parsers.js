import type { TreeStream } from "../../Stream/TreeStream/interfaces.js"
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

import { BasicPattern } from "../../Pattern/classes.js"
import { extendClass } from "../../utils.js"

export class MultiIndex extends BasicPattern<number[]> implements MultiIndexType {
	levels: number

	equals: (x: MultiIndex) => boolean
	slice: (from?: number, to?: number) => number[]
	convert: (stream: TreeStream) => number
	firstLevel: () => number[]
	lastLevel: () => number[]
	copy: () => MultiIndex

	constructor(multindex: number[] = []) {
		super(multindex)
	}
}

extendClass(MultiIndex, {
	levels: { get: multiIndexLevelsGetter, set: multiIndexLevelsSetter },
	convert: { value: multiIndexConvert },
	compare: { value: multiIndexCompare },
	equals: { value: multiIndexEqual },
	copy: { value: multiIndexCopy },
	slice: { value: multiIndexSlice },
	firstLevel: { value: multiIndexFirstLevel },
	lastLevel: { value: multiIndexLastLevel }
})

export * from "./MultiIndexModifier/classes.js"

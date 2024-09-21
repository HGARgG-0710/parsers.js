import { MultiIndexModifier } from "./MultiIndexModifier/classes.js"
import { Slicer } from "./Slicer/classes.js"
import type { MultiIndex } from "./interfaces.js"
import {
	multiIndexConvert,
	multiIndexCompare,
	multiIndexEqual,
	multiIndexCopy,
	multiIndexSlice,
	multiIndexFirstLevel,
	multiIndexLastLevel
} from "./methods.js"

export function MultiIndex(multindex: number[]): MultiIndex {
	const T = {
		value: multindex,
		slicer: Slicer(multindex),
		convert: multiIndexConvert,
		compare: multiIndexCompare,
		equals: multiIndexEqual,
		copy: multiIndexCopy,
		slice: multiIndexSlice,
		firstLevel: multiIndexFirstLevel,
		lastLevel: multiIndexLastLevel
	} as unknown as MultiIndex
	T.modifier = MultiIndexModifier(T)
	return T
}

export * as MultiIndexModifier from "./MultiIndexModifier/classes.js"
export * as Slicer from "./Slicer/classes.js"

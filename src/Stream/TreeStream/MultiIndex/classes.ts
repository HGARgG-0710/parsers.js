import { Slicer } from "_src/types.js";
import { MultiIndexModifier } from "_src/types/Stream/TreeStream/MultiIndex.js";
import type { MultiIndex } from "_src/types/Stream/TreeStream/MultiIndex/MultiIndex.js";
import type { MultiIndex } from "./interfaces.js";
import { multiIndexConvert, multiIndexCompare, multiIndexEqual, multiIndexCopy, multiIndexSlice, multiIndexFirstLevel, multiIndexLastLevel } from "./methods.js";


export function MultiIndex(multindex: number[]): MultiIndex {
	const T = {
		value: multindex,
		convert: multiIndexConvert,
		compare: multiIndexCompare,
		equals: multiIndexEqual,
		copy: multiIndexCopy,
		slicer: Slicer(multindex),
		slice: multiIndexSlice,
		firstLevel: multiIndexFirstLevel,
		lastLevel: multiIndexLastLevel
	} as unknown as MultiIndex
	T.modifier = MultiIndexModifier(T)
	return T
}

export * as MultiIndexModifier from "./MultiIndexModifier/classes.js"

import type { SummatFunction } from "../types/Summat.js"

import { type IndexMap } from "../types/IndexMap.js"
import type { TokenizablePattern } from "src/types/Pattern/TokenizablePattern.js"

export function PatternTokenizer<KeyType = any, OutType = any>(
	tokenMap: IndexMap<KeyType, SummatFunction<any, KeyType, OutType>>
) {
	return function <Type = any>(pattern: TokenizablePattern<Type, KeyType, OutType>) {
		for (const pair of tokenMap) pattern.tokenize(...pair)
		return pattern.result
	}
}

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { TokenizablePattern } from "../../Pattern/TokenizablePattern/interfaces.js"
import type { IndexMap } from "src/IndexMap/interfaces.js"

export function PatternTokenizer<KeyType = any, OutType = any>(
	tokenMap: IndexMap<KeyType, SummatFunction<any, KeyType, OutType>>
) {
	return function <Type = any>(pattern: TokenizablePattern<Type, KeyType, OutType>) {
		for (const pair of tokenMap) pattern.tokenize(...pair)
		return pattern.result
	}
}

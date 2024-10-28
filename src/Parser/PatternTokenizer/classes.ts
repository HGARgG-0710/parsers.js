import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { TokenizablePattern } from "../../Pattern/TokenizablePattern/interfaces.js"
import type { IndexMap } from "../../IndexMap/interfaces.js"

export function PatternTokenizer<Type = any, KeyType = any, OutType = any>(
	tokenMap: IndexMap<KeyType, SummatFunction<any, Type, OutType>>
) {
	return function (pattern: TokenizablePattern<Type, KeyType, OutType>) {
		for (const [key, handler] of tokenMap) pattern.tokenize(key, handler)
		return pattern.result
	}
}

import type { EliminablePattern } from "../Eliminable/interfaces.js"
import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { TokenizablePattern } from "../Tokenizable/interfaces.js"
import type { IndexMap } from "../IndexMap/interfaces.js"

export function PatternEliminator<EliminatedType = any>(eliminated: EliminatedType[]) {
	return function <Type = any>(pattern: EliminablePattern<Type, EliminatedType>) {
		for (const elim of eliminated) pattern.eliminate(elim)
		return pattern
	}
}

export function PatternTokenizer<Type = any, KeyType = any, OutType = any>(
	tokenMap: IndexMap<KeyType, SummatFunction<any, Type, OutType>>
) {
	return function (pattern: TokenizablePattern<Type, KeyType, OutType>) {
		for (const [key, handler] of tokenMap) pattern.tokenize(key, handler)
		return pattern
	}
}

export * from "./PatternValidator/classes.js"
export * from "./LayeredParser/classes.js"
export * from "./TableMap/classes.js"

import type { EliminablePattern } from "../types/Pattern/EliminablePattern.js"

export function PatternEliminator<EliminatedType = any>(eliminated: EliminatedType[]) {
	return function <Type = any>(pattern: EliminablePattern<Type, EliminatedType>) {
		for (const elim of eliminated) pattern.eliminate(elim)
		return pattern
	}
}

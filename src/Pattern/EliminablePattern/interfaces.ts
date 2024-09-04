import type { Pattern, Flushable, Resulting } from "../interfaces.js"

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Pattern<Type>,
		Resulting<Type>,
		Flushable {
	eliminate(eliminated: EliminatedType): Type
}

export type EliminableStringPattern = EliminablePattern<string, string | RegExp>

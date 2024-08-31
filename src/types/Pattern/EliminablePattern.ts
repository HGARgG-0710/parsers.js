import type { Pattern } from "../Pattern.js"
import type { Flushable, Resulting } from "../../misc.js"

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Pattern<Type>,
		Resulting<Type>,
		Flushable {
	eliminate(eliminated: EliminatedType): Type
}

export type EliminableStringPattern = EliminablePattern<string, string | RegExp>

export function eliminableStringPatternEliminate(
	this: EliminableStringPattern,
	eliminated: string | RegExp
): string {
	return (this.result = this.result.split(eliminated).join(""))
}

export function eliminableStringPatternFlush(this: EliminableStringPattern) {
	this.result = this.value
}

export function EliminableStringPattern(value: string): EliminableStringPattern {
	return {
		value,
		result: value,
		flush: eliminableStringPatternFlush,
		eliminate: eliminableStringPatternEliminate
	}
}

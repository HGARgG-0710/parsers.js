import type { EliminableStringPattern } from "./interfaces.js"

export function eliminableStringPatternFlush(this: EliminableStringPattern) {
	this.result = this.value
}

export function eliminableStringPatternEliminate(
	this: EliminableStringPattern,
	eliminated: string | RegExp
): string {
	return (this.result = this.result.split(eliminated).join(""))
}

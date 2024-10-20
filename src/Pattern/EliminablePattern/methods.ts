import type { EliminableStringPattern } from "./interfaces.js"
import { string } from "@hgargg-0710/one"
const { extract } = string

export function eliminableStringPatternFlush(this: EliminableStringPattern) {
	this.result = this.value
}

export function eliminableStringPatternEliminate(
	this: EliminableStringPattern,
	eliminated: string | RegExp
): string {
	return (this.result = extract(this.result, eliminated))
}

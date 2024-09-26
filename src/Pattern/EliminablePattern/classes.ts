import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"
import {
	eliminableStringPatternFlush,
	eliminableStringPatternEliminate
} from "./methods.js"

export class EliminableStringPattern implements EliminableStringPatternType {
	value: string
	result: string

	flush: () => void
	eliminate: (eliminated: string | RegExp) => string

	constructor(value: string) {
		this.value = this.result = value
	}
}

Object.defineProperties(EliminableStringPattern.prototype, {
	flush: { value: eliminableStringPatternFlush },
	eliminate: { value: eliminableStringPatternEliminate }
})

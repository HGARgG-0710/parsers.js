import type { EliminableStringPattern } from "./interfaces.js"
import {
	eliminableStringPatternFlush,
	eliminableStringPatternEliminate
} from "./methods.js"

export function EliminableStringPattern(value: string): EliminableStringPattern {
	return {
		value,
		result: value,
		flush: eliminableStringPatternFlush,
		eliminate: eliminableStringPatternEliminate
	}
}

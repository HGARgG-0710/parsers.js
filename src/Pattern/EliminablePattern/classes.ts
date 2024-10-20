import { FlushablePattern } from "../classes.js"
import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"
import {
	eliminableStringPatternFlush,
	eliminableStringPatternEliminate
} from "./methods.js"

export class EliminableStringPattern
	extends FlushablePattern<string>
	implements EliminableStringPatternType
{
	result: string
	eliminate: (eliminated: string | RegExp) => string
	constructor(value: string) {
		super(value)
	}
}

Object.defineProperties(EliminableStringPattern.prototype, {
	flush: { value: eliminableStringPatternFlush },
	eliminate: { value: eliminableStringPatternEliminate }
})

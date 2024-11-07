import { FlushablePattern } from "../Pattern/classes.js"
import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"
import {
	eliminableStringFlush,
	eliminableStringEliminate
} from "./methods.js"

export class EliminableString
	extends FlushablePattern<string>
	implements EliminableStringPatternType
{
	result: string
	eliminate: (eliminated: string | RegExp) => string
	constructor(value: string) {
		super(value)
	}
}

Object.defineProperties(EliminableString.prototype, {
	flush: { value: eliminableStringFlush },
	eliminate: { value: eliminableStringEliminate }
})

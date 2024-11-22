import type { EliminableStringPattern as EliminableStringPatternType } from "./interfaces.js"

import { FlushablePattern } from "../Pattern/classes.js"
import { extendClass } from "../utils.js"
import { eliminableFlush, eliminableStringEliminate } from "./methods.js"

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

extendClass(EliminableString, {
	flush: { value: eliminableFlush },
	eliminate: { value: eliminableStringEliminate }
})

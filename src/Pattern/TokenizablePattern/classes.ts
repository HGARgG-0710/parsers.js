import { tokenizableStringPatternFlush } from "./methods.js"
import type { TokenizableStringPattern } from "./interfaces.js"
import { tokenizableStringPatternTokenize } from "./methods.js"

export function TokenizableStringPattern<OutType = any>(
	value: string
): TokenizableStringPattern<OutType> {
	return {
		value,
		result: [],
		tokenize: tokenizableStringPatternTokenize<OutType>,
		flush: tokenizableStringPatternFlush
	}
}

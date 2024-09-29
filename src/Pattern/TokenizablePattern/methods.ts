import { inplace, typeof as type } from "@hgargg-0710/one"
const { replace } = inplace
const { isString } = type

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	TokenizationResult,
	TokenizableStringPattern as TokenizableStringPatternType
} from "./interfaces.js"
import { tokenizeString } from "./utils.js"
import { TokenizableStringPattern } from "./classes.js"

export function tokenizableStringPatternTokenize<OutType = any>(
	this: TokenizableStringPatternType<OutType>,
	key: string | RegExp,
	handler: SummatFunction<any, string, OutType>
): TokenizationResult<string, OutType> {
	if (!this.result.length)
		return (this.result = tokenizeString<OutType>(this.value, key, handler))

	for (let r = this.result.length; r--; ) {
		const current = this.result[r]
		if (isString(current))
			replace(
				this.result,
				r,
				...new TokenizableStringPattern<OutType>(current).tokenize(key, handler)
			)
	}

	return this.result
}

export function tokenizableStringPatternFlush(this: TokenizableStringPatternType): void {
	this.result = []
}

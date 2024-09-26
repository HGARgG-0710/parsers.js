import type { SummatFunction } from "@hgargg-0710/summat.ts"

import {
	tokenizableStringPatternFlush,
	tokenizableStringPatternTokenize
} from "./methods.js"

import type {
	TokenizableStringPattern as TokenizableStringPatternType,
	TokenizationResult
} from "./interfaces.js"

export class TokenizableStringPattern<OutType = any>
	implements TokenizableStringPatternType<OutType>
{
	value: string
	result: TokenizationResult<string, OutType>

	tokenize: (
		key: string | RegExp,
		handler: SummatFunction<any, string | RegExp, OutType>
	) => TokenizationResult<string, OutType>
	flush: () => void

	constructor(value: string) {
		this.value = value
		this.result = []
	}
}

Object.defineProperties(tokenizableStringPatternFlush.prototype, {
	tokenize: { value: tokenizableStringPatternTokenize },
	flush: { value: tokenizableStringPatternFlush }
})

import type { SummatFunction } from "@hgargg-0710/summat.ts"

import {
	tokenizableStringPatternFlush,
	tokenizableStringPatternTokenize
} from "./methods.js"

import type {
	TokenizableStringPattern as TokenizableStringPatternType,
	TokenizationResult
} from "./interfaces.js"
import { FlushablePattern } from "../classes.js"

export class TokenizableStringPattern<OutType = any>
	extends FlushablePattern<string>
	implements TokenizableStringPatternType<OutType>
{
	result: TokenizationResult<string, OutType>
	tokenize: (
		key: string | RegExp,
		handler: SummatFunction<any, string | RegExp, OutType>
	) => TokenizationResult<string, OutType>

	constructor(value: string) {
		super(value)
	}
}

Object.defineProperties(tokenizableStringPatternFlush.prototype, {
	tokenize: { value: tokenizableStringPatternTokenize },
	flush: { value: tokenizableStringPatternFlush }
})

import type { SummatFunction } from "../Summat.js"
import { tokenizeString, type Pattern } from "../Pattern.js"
import { type Flushable } from "src/misc.js"

import { inplace } from "@hgargg-0710/one"
import { isString } from "@hgargg-0710/one/dist/src/typeof/typeof.js"
import type { Resulting } from "src/misc.js"
const { replace } = inplace

export type TokenizationResult<Type = any, OutType = any> = (Type | OutType)[]

export interface TokenizablePattern<Type = any, InType = any, OutType = any>
	extends Pattern<Type>,
		Flushable,
		Resulting<TokenizationResult<Type, OutType>> {
	tokenize(
		key: InType,
		handler: SummatFunction<any, InType, OutType>
	): TokenizationResult<Type, OutType>
}

export function tokenizableStringPatternTokenize<OutType = any>(
	this: TokenizableStringPattern<OutType>,
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
				...TokenizableStringPattern<OutType>(current).tokenize(key, handler)
			)
	}

	return this.result
}

export function tokenizableStringPatternFlush(this: TokenizableStringPattern): void {
	this.result = []
}

export type TokenizableStringPattern<OutType = any> = TokenizablePattern<
	string,
	RegExp | string,
	OutType
>

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

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern, Flushable, Resulting } from "../interfaces.js"

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

export type TokenizableStringPattern<OutType = any> = TokenizablePattern<
	string,
	RegExp | string,
	OutType
>

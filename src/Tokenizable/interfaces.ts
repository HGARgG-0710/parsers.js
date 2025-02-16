import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Flushable, Resulting } from "../Pattern/interfaces.js"

export type TokenizationResult<Type = any, OutType = any> = (Type | OutType)[]

export type FreeTokenizer<Type = any, InType = any> = <OutType = any>(
	value: Type,
	key: InType,
	handler: SummatFunction<any, Type, OutType>
) => TokenizationResult<Type, OutType>

export interface Tokenizable<Type = any, InType = any, OutType = any> {
	tokenize: (
		key: InType,
		handler: SummatFunction<any, Type, OutType>
	) => TokenizationResult<Type, OutType>
}

export interface TokenizablePattern<Type = any, InType = any, OutType = any>
	extends Flushable,
		Resulting<TokenizationResult<Type, OutType>>,
		Tokenizable<Type, InType, OutType> {}

export interface DelegateTokenizablePattern<Type = any, InType = any, OutType = any>
	extends TokenizablePattern<Type, InType, OutType> {
	tokenizer: FreeTokenizer<Type, InType>
}

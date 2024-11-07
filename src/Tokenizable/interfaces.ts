import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern, Flushable, Resulting } from "../Pattern/interfaces.js"

export type TokenizationResult<Type = any, OutType = any> = (Type | OutType)[]

export type FreeTokenizer<Type = any, InType = any> = <OutType = any>(
	value: Type,
	key: InType,
	handler: SummatFunction<any, Type, OutType>
) => TokenizationResult<Type, OutType>

export type MethodTokenizer<Type = any, InType = any, OutType = any> = (
	key: InType,
	handler: SummatFunction<any, Type, OutType>
) => TokenizationResult<Type, OutType>

export interface Tokenizable<Type = any, InType = any, OutType = any> extends Summat {
	tokenize: MethodTokenizer<Type, InType, OutType>
}

export interface TokenizablePattern<Type = any, InType = any, OutType = any>
	extends Pattern<Type>,
		Flushable,
		Resulting<TokenizationResult<Type, OutType>>,
		Tokenizable<Type, InType, OutType> {}

export interface DelegateTokenizablePattern<Type = any, InType = any, OutType = any>
	extends TokenizablePattern<Type, InType, OutType> {
	tokenizer: FreeTokenizer<Type, InType>
	isType: (x: any) => x is Type
}

import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pointer, Flushable, Resulting } from "../Pattern/interfaces.js"
import type { TypePredicate } from "../interfaces.js"

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

export interface Tokenizable<Type = any, InType = any, OutType = any> {
	tokenize: MethodTokenizer<Type, InType, OutType>
}

export interface TokenizablePattern<Type = any, InType = any, OutType = any>
	extends Pointer<Type>,
		Flushable,
		Resulting<TokenizationResult<Type, OutType>>,
		Tokenizable<Type, InType, OutType> {}

export interface DelegateTokenizablePattern<Type = any, InType = any, OutType = any>
	extends TokenizablePattern<Type, InType, OutType> {
	tokenizer: FreeTokenizer<Type, InType>
	isType: TypePredicate<Type>
}

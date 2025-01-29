import type { type } from "@hgargg-0710/one"
import type { Pointer } from "../Pattern/interfaces.js"

export interface Token<Type = any, Value = any>
	extends TokenInstance<Type>,
		Pointer<Value> {}

export interface TokenInstance<Type = any> {
	type: Type
}

export interface TokenInstanceClass<Type = any> extends TokenInstance<Type> {
	new (): TokenInstance<Type>
	is: type.TypePredicate<TokenInstance<Type>>
}

export interface TokenType<Type = any, Value = any> {
	new (value: Value): Token<Type, Value>
	is: type.TypePredicate<Token<Type, Value>>
}

export interface MarkedTokenType<Type = any, Value = any>
	extends TokenType<Type, Value>,
		TokenInstance<Type> {}

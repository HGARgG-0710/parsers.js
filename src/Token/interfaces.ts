import type { Pointer } from "../Pattern/interfaces.js"
import type { TypePredicate } from "../interfaces.js"

export interface Token<Type = any, Value = any>
	extends TokenInstance<Type>,
		Pointer<Value> {}

export interface TokenInstance<Type = any> {
	type: Type
}

export interface TokenInstanceClass<Type = any> extends TokenInstance<Type> {
	new (): TokenInstance<Type>
	is: TypePredicate<TokenInstance<Type>>
}

export interface TokenType<Type = any, Value = any> {
	new (value: Value): Token<Type, Value>
	is: TypePredicate<Token<Type, Value>>
}

export interface MarkedTokenType<Type = any, Value = any>
	extends TokenType<Type, Value>,
		TokenInstance<Type> {}

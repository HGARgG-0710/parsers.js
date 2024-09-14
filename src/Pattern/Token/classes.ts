import { object } from "@hgargg-0710/one"
const { structCheck } = object

import type { Token, TokenInstanceClass, TokenType } from "./interfaces.js"
import { isType } from "./utils.js"

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}

Token.is = structCheck<Token>(["type", "value"])
Token.type = (x: any) => x.type
Token.value = (x: any) => x.value

export function TokenType<Type = any, ValueType = any>(
	type: Type
): TokenType<Type, ValueType> {
	const tt = (value: ValueType) => Token<Type, ValueType>(type, value)
	tt.is = isType<Type>(type)
	return tt
}

export function TokenInstance<Type = any>(
	type: any,
	cached: boolean = true
): TokenInstanceClass<Type> {
	const cachedInstance = { type }
	const ti = (
		cached ? () => cachedInstance : () => ({ type })
	) as TokenInstanceClass<Type>
	ti.is = isType<Type>(type)
	return ti
}

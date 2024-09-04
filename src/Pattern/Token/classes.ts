import { array, object } from "@hgargg-0710/one"
const { structCheck } = object
const { propPreserve } = array

import type { Token, TokenInstanceClass, TokenType } from "./interfaces.js"
import { isType, iteratorCheck } from "./utils.js"

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

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	const ti: TokenInstanceClass<Type> = () => ({ type })
	ti.is = isType<Type>(type)
	return ti
}

export const ArrayToken = propPreserve((token: Token) => [...Token.value(token)])

export function RecursiveArrayToken(recursiveToken: Token) {
	const isCollection = "value" in recursiveToken && iteratorCheck(recursiveToken.value)
	if (isCollection) recursiveToken.value = recursiveToken.value.map(RecursiveArrayToken)
	return isCollection ? ArrayToken(recursiveToken) : recursiveToken
}

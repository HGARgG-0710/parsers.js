import type { Summat, SummatIterable } from "@hgargg-0710/summat.ts"
import { array, object, function as f } from "@hgargg-0710/one"
const { and } = f
const { structCheck } = object
const { propPreserve } = array

import type { Pattern } from "./Pattern.js"

export interface Token<Type = any, Value = any>
	extends TokenInstance<Type>,
		Pattern<Value> {}

export interface TokenInstance<Type = any> extends Summat {
	type: Type
}

export interface TokenInstanceClass<Type = any> extends Summat {
	(): TokenInstance<Type>
	is: (x: any) => x is TokenInstance<Type>
}

export interface TokenType<Type = any, Value = any> extends Summat {
	(value: Value): Token<Type, Value>
	is: (x: any) => x is TokenInstance<Type>
}

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}
Token.is = structCheck<Token>("type", "value")
Token.type = (x: any) => x.type
Token.value = (x: any) => x.value

const emptyStruct = structCheck()
export function isType<Type = any>(type: Type): (x: any) => x is TokenInstance<Type> {
	return and(emptyStruct, (x: any): boolean => Token.type(x) === type) as (
		x: any
	) => x is TokenInstance<Type>
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	const ti: TokenInstanceClass<Type> = () => ({ type })
	ti.is = isType<Type>(type)
	return ti
}

export function TokenType<Type = any, ValueType = any>(
	type: Type
): TokenType<Type, ValueType> {
	const tt = (value: ValueType) => Token<Type, ValueType>(type, value)
	tt.is = isType<Type>(type)
	return tt
}

export const ArrayToken = propPreserve((token: Token) => [...Token.value(token)])

export const iteratorCheck = structCheck<SummatIterable>(Symbol.iterator)
export function RecursiveArrayToken(recursiveToken: Token) {
	const isCollection = "value" in recursiveToken && iteratorCheck(recursiveToken.value)
	if (isCollection) recursiveToken.value = recursiveToken.value.map(RecursiveArrayToken)
	return isCollection ? ArrayToken(recursiveToken) : recursiveToken
}

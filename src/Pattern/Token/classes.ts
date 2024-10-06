import type { Token, TokenInstance, TokenInstanceClass, TokenType } from "./interfaces.js"
import { isType } from "./utils.js"
import { ChildlessTree, ChildrenTree, MultTree, SingleTree } from "src/Tree/classes.js"

import { object } from "@hgargg-0710/one"
const { structCheck } = object

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}

Token.is = structCheck<Token>(["type", "value"])
Token.type = (x: any) => x.type
Token.value = (x: any) => x.value

export function SimpleTokenType<Type = any, ValueType = any>(
	type: Type
): TokenType<Type, ValueType> {
	class stt implements Token<Type, ValueType> {
		type: Type
		value: ValueType

		static type: Type
		static is: (x: any) => x is Token<Type, ValueType>

		constructor(value: ValueType) {
			this.value = value
		}
	}
	stt.type = stt.prototype.type = type
	stt.is = isType<Type>(type) as (x: any) => x is Token<Type, ValueType>
	return stt
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	class ti implements TokenInstance<Type> {
		type: Type
		static is: (x: any) => x is TokenInstance<Type>
	}
	ti.prototype.type = type
	ti.is = isType<Type>(type)
	return ti
}

/**
 * An object for constructing 'Token' (or, 'Pattern') -based `Tree`-s
 */
export const TokenTree = {
	children: ChildrenTree("value"),
	multiple: MultTree("value"),
	single: SingleTree("value"),
	childless: ChildlessTree("value")
}

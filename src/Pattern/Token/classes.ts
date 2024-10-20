import type { Pattern } from "../interfaces.js"
import type { Token, TokenInstance, TokenInstanceClass, TokenType } from "./interfaces.js"
import { ChildlessTree, ChildrenTree, MultTree, SingleTree } from "../../Tree/classes.js"
import { isType } from "./utils.js"

import { object } from "@hgargg-0710/one"
import { BasicPattern } from "../classes.js"
const { structCheck } = object

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}

Token.is = structCheck<Token>(["type", "value"])
Token.type = <Type = any>(x: TokenInstance<Type>) => x.type
Token.value = <Type = any>(x: Pattern<Type>) => x.value

export function SimpleTokenType<Type = any, ValueType = any>(
	type: Type
): TokenType<Type, ValueType> {
	class stt extends BasicPattern<ValueType> implements Token<Type, ValueType> {
		static is: (x: any) => x is Token<Type, ValueType>
		static type: Type
		type: Type

		constructor(value: ValueType) {
			super(value)
		}
	}
	stt.type = stt.prototype.type = type
	stt.is = isType<Type>(type) as (x: any) => x is Token<Type, ValueType>
	return stt
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	class ti implements TokenInstance<Type> {
		static is: (x: any) => x is TokenInstance<Type>
		static type: Type
		type: Type
	}
	ti.type = ti.prototype.type = type
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

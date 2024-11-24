import type {
	Token,
	TokenInstance as TokenInstanceType,
	TokenInstanceClass,
	TokenType
} from "./interfaces.js"

import { ChildlessTree, ChildrenTree, MultTree, SingleTree } from "../Tree/classes.js"
import { BasicPattern } from "../Pattern/classes.js"
import { isType } from "./utils.js"
import type { TypePredicate } from "../interfaces.js"

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}

export function SimpleTokenType<Type = any, ValueType = any>(
	type: Type
): TokenType<Type, ValueType> {
	class stt extends BasicPattern<ValueType> implements Token<Type, ValueType> {
		static is: TypePredicate<Token<Type, ValueType>>
		static type: Type
		type: Type

		constructor(value: ValueType) {
			super(value)
		}
	}
	stt.type = stt.prototype.type = type
	stt.is = isType<Type>(type) as TypePredicate<Token<Type, ValueType>>
	return stt
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	class ti implements TokenInstanceType<Type> {
		static is: TypePredicate<TokenInstanceType<Type>>
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

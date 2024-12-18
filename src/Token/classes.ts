import type {
	Token,
	TokenInstance as TokenInstanceType,
	TokenInstanceClass,
	TokenType
} from "./interfaces.js"

import type { TypePredicate } from "../interfaces.js"

import { BasicPattern } from "src/Pattern/abstract.js"
import { isType } from "./utils.js"

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
		static readonly type: Type = type

		type: Type
		value: ValueType

		constructor(value: ValueType) {
			super(value)
		}
	}
	stt.prototype.type = type
	stt.is = isType<Type>(type) as TypePredicate<Token<Type, ValueType>>
	return stt
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	class ti implements TokenInstanceType<Type> {
		static is: TypePredicate<TokenInstanceType<Type>>
		static readonly type: Type = type
		type: Type
	}
	ti.prototype.type = type
	ti.is = isType<Type>(type)
	return ti
}

import type {
	Token,
	TokenInstance as TokenInstanceType,
	TokenInstanceClass,
	MarkedTokenType
} from "./interfaces.js"

import type { TypePredicate } from "../interfaces.js"

import { BasicPattern } from "src/Pattern/abstract.js"
import { isType } from "./utils.js"

export function token<Type = any, Value = any>(
	type: Type,
	value: Value
): Token<Type, Value> {
	return { type, value }
}

export function TokenType<Type = any, ValueType = any>(
	type: Type
): MarkedTokenType<Type, ValueType> {
	class stt extends BasicPattern<ValueType> implements Token<Type, ValueType> {
		static is: TypePredicate<Token<Type, ValueType>>
		static readonly type: Type = type
		type: Type

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

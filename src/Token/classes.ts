import type { type } from "@hgargg-0710/one"
import type {
	IToken,
	ITokenInstance,
	TokenInstanceClass,
	MarkedTokenType
} from "./interfaces.js"

import { BasicPattern } from "src/Pattern/abstract.js"
import { isType } from "./utils.js"

export function Token<Type = any, Value = any>(
	type: Type,
	value: Value
): IToken<Type, Value> {
	return { type, value }
}

export function TokenType<Type = any, ValueType = any>(
	type: Type
): MarkedTokenType<Type, ValueType> {
	class stt extends BasicPattern<ValueType> implements IToken<Type, ValueType> {
		static is: type.TypePredicate<IToken<Type, ValueType>>
		static readonly type: Type = type
		type: Type

		constructor(value: ValueType) {
			super(value)
		}
	}
	stt.prototype.type = type
	stt.is = isType<Type>(type) as type.TypePredicate<IToken<Type, ValueType>>
	return stt
}

export function TokenInstance<Type = any>(type: any): TokenInstanceClass<Type> {
	class ti implements ITokenInstance<Type> {
		static is: type.TypePredicate<ITokenInstance<Type>>
		static readonly type: Type = type
		type: Type
	}
	ti.prototype.type = type
	ti.is = isType<Type>(type)
	return ti
}

import type { type } from "@hgargg-0710/one"

import type {
	IToken,
	ITokenInstance,
	ITokenInstanceClass,
	IMarkedTokenType
} from "./interfaces.js"

import { BasicPattern } from "../Pattern/abstract.js"
import { isType } from "./utils.js"

abstract class PreToken<
	Type = any,
	ValueType = any
> extends BasicPattern<ValueType> {
	type: Type;

	["constructor"]: new (value: ValueType) => typeof this

	copy() {
		return new this.constructor(this.value)
	}
}

abstract class PreTokenInstance<Type = any> {
	type: Type;

	["constructor"]: new () => typeof this

	copy() {
		return new this.constructor()
	}
}

export function TokenType<Type = any, ValueType = any>(
	type: Type
): IMarkedTokenType<Type, ValueType> {
	class stt
		extends PreToken<Type, ValueType>
		implements IToken<Type, ValueType>
	{
		static is: type.TypePredicate<IToken<Type, ValueType>>
		static readonly type: Type = type

		constructor(value: ValueType) {
			super(value)
		}
	}
	stt.prototype.type = type
	stt.is = isType<Type>(type) as type.TypePredicate<IToken<Type, ValueType>>
	return stt
}

export function TokenInstance<Type = any>(
	type: Type
): ITokenInstanceClass<Type> {
	class ti extends PreTokenInstance<Type> implements ITokenInstance<Type> {
		static is: type.TypePredicate<ITokenInstance<Type>>
		static readonly type: Type = type
	}
	ti.prototype.type = type
	ti.is = isType<Type>(type)
	return ti
}

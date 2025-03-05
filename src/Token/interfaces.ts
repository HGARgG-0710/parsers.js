import type { type } from "@hgargg-0710/one"
import type { Pointer } from "../Pattern/interfaces.js"

export interface IToken<Type = any, Value = any>
	extends ITokenInstance<Type>,
		Pointer<Value> {}

export interface ITokenInstance<Type = any> {
	type: Type
}

export interface TokenInstanceClass<Type = any> extends ITokenInstance<Type> {
	new (): ITokenInstance<Type>
	is: type.TypePredicate<ITokenInstance<Type>>
}

export interface ITokenType<Type = any, Value = any> {
	new (value: Value): IToken<Type, Value>
	is: type.TypePredicate<IToken<Type, Value>>
}

export interface MarkedTokenType<Type = any, Value = any>
	extends ITokenType<Type, Value>,
		ITokenInstance<Type> {}

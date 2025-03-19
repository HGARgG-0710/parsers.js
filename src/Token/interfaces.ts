import type { type } from "@hgargg-0710/one"
import type { IPointer } from "../Pattern/interfaces.js"

export interface IToken<Type = any, Value = any>
	extends ITokenInstance<Type>,
		IPointer<Value> {}

export interface ITokenInstance<Type = any> {
	type: Type
}

export interface ITypeCheckable<Type = any> {
	is: type.TypePredicate<Type>
}

export interface ITokenInstanceClass<Type = any>
	extends ITokenInstance<Type>,
		ITypeCheckable<ITokenInstance<Type>> {
	new (): ITokenInstance<Type>
}

export interface ITokenType<Type = any, Value = any>
	extends ITypeCheckable<IToken<Type, Value>> {
	new (value: Value): IToken<Type, Value>
}

export interface IMarkedTokenType<Type = any, Value = any>
	extends ITokenType<Type, Value>,
		ITokenInstance<Type> {}

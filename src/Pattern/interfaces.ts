import type { Eliminable } from "../Eliminable/interfaces.js"
import type { Flushable } from "../interfaces.js"

export interface Resulting<ResultType = any> {
	result: ResultType
}

export interface IPointer<Type = any> {
	value: Type
}

export type Pattern<Type = any> = Partial<IPointer<Type>>

export type RecursivePointer<T = any> = IPointer<T | RecursivePointer<T>>

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Resulting<Type>,
		Flushable,
		Eliminable<EliminatedType, Type> {}

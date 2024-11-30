import type { Flushable, Resulting, Pointer } from "../Pattern/interfaces.js"

export interface Eliminable<EliminatedType = any, Type = any> {
	eliminate: (eliminated: EliminatedType) => Type
}

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Pointer<Type>,
		Resulting<Type>,
		Flushable,
		Eliminable<EliminatedType, Type> {}

export type EliminableStringPattern = EliminablePattern<string, string | RegExp>

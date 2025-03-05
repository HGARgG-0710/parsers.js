import type { Flushable, Resulting } from "../Pattern/interfaces.js"

export interface Eliminable<EliminatedType = any, Type = any> {
	eliminate: (eliminated: EliminatedType) => Type
}

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Resulting<Type>,
		Flushable,
		Eliminable<EliminatedType, Type> {}

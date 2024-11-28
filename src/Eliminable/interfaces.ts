import type { Summat } from "@hgargg-0710/summat.ts"
import type { Flushable, Resulting, Pointer } from "../Pattern/interfaces.js"

export interface Eliminable<EliminatedType = any, Type = any> extends Summat {
	eliminate: (eliminated: EliminatedType) => Type
}

export interface EliminablePattern<Type = any, EliminatedType = any>
	extends Pointer<Type>,
		Resulting<Type>,
		Flushable,
		Eliminable<EliminatedType, Type> {}

export type EliminableStringPattern = EliminablePattern<string, string | RegExp>

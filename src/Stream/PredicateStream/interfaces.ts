import type { Summat } from "@hgargg-0710/summat.ts"
import type { Inputted } from "../StreamClass/interfaces.js"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Posed, PredicatePosition } from "../../Position/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"

export interface LookaheadHaving extends Summat {
	hasLookAhead: boolean
}

export interface Lookahead<Type = any> extends Summat {
	lookAhead: Type
}

export interface Proddable<Type = any> extends Summat {
	prod: () => Type
}

export interface SinglePositionLookahead<Type = any>
	extends Proddable<Type>,
		Lookahead<Type> {}

export interface BasicPredicated<Type = any>
	extends SinglePositionLookahead<Type>,
		Posed<number> {
	predicate: PredicatePosition
}

export interface PredicateStream<Type = any>
	extends BasicStream<Type>,
		BasicPredicated<Type>,
		Inputted<ReversibleStream<Type>> {}

export interface EffectivePredicateStream<Type = any>
	extends StreamClassInstance<Type>,
		Superable,
		BasicPredicated<Type>,
		Inputted<ReversibleStream<Type> & IsEndCurrable>,
		LookaheadHaving {}

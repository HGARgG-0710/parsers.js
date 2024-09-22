import type { Summat } from "@hgargg-0710/summat.ts"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { PredicatePosition } from "../PositionalStream/Position/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface Predicated extends Summat {
	predicate: PredicatePosition
}

export interface LookaheadHaving extends Summat {
	hasLookAhead: boolean
}

export interface Lookahead<Type = any> extends Summat {
	lookAhead: Type
}

export interface Proddable<Type = any> extends Summat {
	prod(): Type
}

export interface SinglePositionLookahead<Type = any>
	extends Proddable<Type>,
		Lookahead<Type> {}

export interface BasicPredicated<Type = any>
	extends Predicated,
		SinglePositionLookahead<Type>,
		IterableStream<Type>,
		PositionalStream<Type, number> {}

export interface PredicateStream<Type = any>
	extends BasicPredicated<Type>,
		Inputted<ReversibleStream<Type>> {}

export interface EffectivePredicateStream<Type = any>
	extends StreamClassInstance<Type>,
		BasicPredicated<Type>,
		Inputted<ReversibleStream<Type> & IsEndCurrable>,
		LookaheadHaving {}

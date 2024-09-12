import type { Summat } from "@hgargg-0710/summat.ts"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
import type { PredicatePosition } from "../PositionalStream/Position/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface StreamPredicated extends Summat {
	predicate: PredicatePosition
}

export interface Lookahead<Type = any> extends Summat {
	lookAhead: Type
}

export interface Proddable<Type = any> extends Summat {
	prod(): Type
}

export interface BasicPredicated<Type = any>
	extends StreamPredicated,
		Lookahead<Type>,
		Proddable<Type>,
		Posed<number> {}

export interface PredicateStream<Type = any>
	extends IterableStream<Type>,
		BasicPredicated<Type>,
		Inputted<ReversibleStream<Type>> {}

export interface EffectivePredicateStream<Type>
	extends StreamClassInstance<Type>,
		BasicPredicated<Type>,
		Inputted<ReversibleStream<Type> & IsEndCurrable> {}

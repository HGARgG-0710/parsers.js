import type { Summat } from "@hgargg-0710/summat.ts"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"
import type { PredicatePosition } from "../../Position/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface LookaheadHaving extends Summat {
	hasLookAhead: boolean
}

export interface SinglePositionLookahead<Type = any> extends Summat {
	prod: () => Type
	lookAhead: Type
}

export interface PredicateStream<Type = any>
	extends StreamClassInstance<Type>,
		Superable,
		SinglePositionLookahead<Type>,
		Pattern<BasicReversibleStream<Type> & IsEndCurrable>,
		LookaheadHaving {
	predicate: PredicatePosition
}

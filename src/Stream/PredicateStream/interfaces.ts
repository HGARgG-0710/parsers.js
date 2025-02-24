import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Posed, PredicatePosition } from "../../Position/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface LookaheadHaving {
	hasLookAhead: boolean
}

export interface SinglePositionLookahead<Type = any> {
	prod: () => Type
	lookAhead: Type
}

export interface PredicateStream<Type = any>
	extends StreamClassInstance<Type>,
		Superable,
		SinglePositionLookahead<Type>,
		Pattern<BasicReversibleStream<Type> & IsEndCurrable>,
		LookaheadHaving,
		Partial<Posed<number>> {
	predicate: PredicatePosition<Type>
}

import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import type { EffectivePredicateStream } from "./interfaces.js"
import {
	effectivePredicateStreamIsEnd,
	effectivePredicateStreamProd,
	predicateStreamCurr,
	predicateStreamNext
} from "./methods.js"
import type { PredicatePosition } from "../PositionalStream/Position/interfaces.js"

export const PredicateStreamClass = StreamClass({
	currGetter: predicateStreamCurr,
	baseNextIter: predicateStreamNext,
	isCurrEnd: effectivePredicateStreamIsEnd
})

export function PredicateStream<Type = any>(
	input: ReversibleStream<Type> & IsEndCurrable,
	predicate: PredicatePosition
): EffectivePredicateStream<Type> {
	const result = Inputted(PredicateStreamClass(), input)
	result.prod = effectivePredicateStreamProd<Type>
	result.pos = 0
	result.predicate = predicate
	return result as EffectivePredicateStream<Type>
}

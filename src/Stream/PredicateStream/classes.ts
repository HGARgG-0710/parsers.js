import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import type { EffectivePredicateStream } from "./interfaces.js"
import {
	effectivePredicateStreamIsEnd,
	effectivePredicateStreamProd,
	predicateStreamCurr,
	effectivePredicateStreamNext
} from "./methods.js"
import type { PredicatePosition } from "../PositionalStream/Position/interfaces.js"
import { preserveDirection } from "../PositionalStream/Position/utils.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"
import { streamIterator } from "../IterableStream/methods.js"

export const PredicateStreamClass = StreamClass({
	currGetter: predicateStreamCurr,
	baseNextIter: effectivePredicateStreamNext,
	isCurrEnd: effectivePredicateStreamIsEnd,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function PredicateStream<Type = any>(
	input: ReversibleStream<Type> & IsEndCurrable,
	predicate: PredicatePosition
): EffectivePredicateStream<Type> {
	const result = Inputted(PredicateStreamClass(), input)
	result.hasLookAhead = false
	result.prod = effectivePredicateStreamProd<Type>
	result.pos = 0
	result.predicate = preserveDirection(predicate, (predicate) => predicate.bind(result))
	result[Symbol.iterator] = streamIterator<Type>
	return result as EffectivePredicateStream<Type>
}

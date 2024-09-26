import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { EffectivePredicateStream } from "./interfaces.js"
import {
	effectivePredicateStreamIsEnd,
	effectivePredicateStreamProd,
	predicateStreamCurr,
	effectivePredicateStreamNext
} from "./methods.js"
import type {
	Position,
	PredicatePosition
} from "../PositionalStream/Position/interfaces.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"
import { effectiveLimitedStreamInitialize } from "../LimitedStream/methods.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"

export const PredicateStreamBase = StreamClass({
	currGetter: predicateStreamCurr,
	baseNextIter: effectivePredicateStreamNext,
	isCurrEnd: effectivePredicateStreamIsEnd,
	defaultIsEnd: underStreamDefaultIsEnd
})

export class PredicateStream<Type = any>
	extends PredicateStreamBase
	implements EffectivePredicateStream<Type>
{
	input: ReversibleStream<Type> & IsEndCurrable
	pos: number
	lookAhead: Type
	hasLookAhead: boolean
	predicate: PredicatePosition

	init: (
		input?: ReversibleStream<Type> & IsEndCurrable,
		predicate?: PredicatePosition
	) => PositionalStream<Type, Position>

	prod: () => Type

	constructor(
		input?: ReversibleStream<Type> & IsEndCurrable,
		predicate?: PredicatePosition
	) {
		super()
		this.init(input, predicate)
		super.init()
	}
}

Object.defineProperties(PredicateStream.prototype, {
	prod: { value: effectivePredicateStreamProd },
	init: { value: effectiveLimitedStreamInitialize }
})

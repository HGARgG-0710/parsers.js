import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { PredicatePosition } from "../../Position/interfaces.js"
import type { EffectivePredicateStream } from "./interfaces.js"

import {
	effectivePredicateStreamIsEnd,
	effectivePredicateStreamProd,
	predicateStreamCurr,
	effectivePredicateStreamNext,
	effectivePredicateStreamInitialize
} from "./methods.js"
import { inputDefaultIsEnd } from "../StreamClass/methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const PredicateStreamBase = StreamClass({
	currGetter: predicateStreamCurr,
	baseNextIter: effectivePredicateStreamNext,
	isCurrEnd: effectivePredicateStreamIsEnd,
	defaultIsEnd: inputDefaultIsEnd
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
	) => PredicateStream<Type>
	super: Summat

	prod: () => Type

	constructor(
		input?: ReversibleStream<Type> & IsEndCurrable,
		predicate?: PredicatePosition
	) {
		super()
		this.init(input, predicate)
	}
}

Object.defineProperties(PredicateStream.prototype, {
	super: { value: PredicateStreamBase.prototype },
	prod: { value: effectivePredicateStreamProd },
	init: { value: effectivePredicateStreamInitialize }
})

import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
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

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

const PredicateStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		currGetter: predicateStreamCurr,
		baseNextIter: effectivePredicateStreamNext,
		isCurrEnd: effectivePredicateStreamIsEnd,
		defaultIsEnd: inputDefaultIsEnd,
		hasPosition
	})
) as (hasPosition: boolean) => new () => StreamClassInstance

export function PredicateStream<Type = any>(
	hasPosition: boolean = false
): new (
	input?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition
) => EffectivePredicateStream<Type> {
	const baseClass = PredicateStreamBase(hasPosition)
	class predicateStream extends baseClass implements EffectivePredicateStream<Type> {
		input: ReversibleStream<Type> & IsEndCurrable
		lookAhead: Type
		hasLookAhead: boolean
		predicate: PredicatePosition

		super: Summat
		prod: () => Type
		init: (
			input?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) => EffectivePredicateStream<Type>

		constructor(
			input?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) {
			super()
			this.init(input, predicate)
		}
	}

	Object.defineProperties(predicateStream.prototype, {
		super: { value: baseClass.prototype },
		prod: { value: effectivePredicateStreamProd },
		init: { value: effectivePredicateStreamInitialize }
	})

	return predicateStream
}

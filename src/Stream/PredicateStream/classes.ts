import type { Summat } from "@hgargg-0710/summat.ts"
import type { PredicatePosition } from "../../Position/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type {
	IsEndCurrable,
	PatternStreamConstructor,
	StreamClassInstance
} from "../StreamClass/interfaces.js"
import type { EffectivePredicateStream } from "./interfaces.js"

import { valueDefaultIsEnd } from "src/Pattern/methods.js"
import {
	effectivePredicateStreamIsEnd,
	effectivePredicateStreamProd,
	predicateStreamCurr,
	effectivePredicateStreamNext,
	effectivePredicateStreamInitialize
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const PredicateStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: predicateStreamCurr,
		baseNextIter: effectivePredicateStreamNext,
		isCurrEnd: effectivePredicateStreamIsEnd,
		defaultIsEnd: valueDefaultIsEnd,
		isPattern: true,
		hasPosition,
		buffer
	}) as PatternStreamConstructor<Type>

export function PredicateStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (
	input?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition
) => EffectivePredicateStream<Type> {
	const baseClass = PredicateStreamBase(hasPosition, buffer)
	class predicateStream extends baseClass implements EffectivePredicateStream<Type> {
		lookAhead: Type
		hasLookAhead: boolean
		predicate: PredicatePosition
		value: ReversibleStream<Type> & IsEndCurrable

		super: Summat
		prod: () => Type
		init: (
			input?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) => EffectivePredicateStream<Type>

		constructor(
			value?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) {
			super(value)
			this.init(value, predicate)
		}
	}

	Object.defineProperties(predicateStream.prototype, {
		super: { value: baseClass.prototype },
		prod: { value: effectivePredicateStreamProd },
		init: { value: effectivePredicateStreamInitialize }
	})

	return predicateStream
}

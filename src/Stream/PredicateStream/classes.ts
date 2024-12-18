import type { Summat } from "@hgargg-0710/summat.ts"
import type { PredicatePosition } from "../../Position/interfaces.js"

import type {
	BasicReversibleStream,
	ReversibleStream
} from "../ReversibleStream/interfaces.js"

import type {
	IsEndCurrable,
	PatternStreamConstructor
} from "../StreamClass/interfaces.js"

import type { PredicateStream as EffectivePredicateStream } from "./interfaces.js"

import { valueDefaultIsEnd } from "../../Pattern/methods.js"
import {
	predicateStreamIsEnd,
	predicateStreamProd,
	predicateStreamCurr,
	predicateStreamNext,
	predicateStreamInitialize
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"
import { extendPrototype } from "../../utils.js"

const PredicateStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: predicateStreamCurr,
		baseNextIter: predicateStreamNext,
		isCurrEnd: predicateStreamIsEnd,
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
		value: BasicReversibleStream<Type> & IsEndCurrable

		super: Summat
		prod: () => Type
		init: (
			input?: BasicReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) => EffectivePredicateStream<Type>

		constructor(
			value?: BasicReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition
		) {
			super(value)
			this.init(value, predicate)
		}
	}

	extendPrototype(predicateStream, {
		super: { value: baseClass.prototype },
		prod: { value: predicateStreamProd },
		init: { value: predicateStreamInitialize }
	})

	return predicateStream
}

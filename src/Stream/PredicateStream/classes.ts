import type { Summat } from "@hgargg-0710/summat.ts"
import type { PredicatePosition } from "../../Position/interfaces.js"
import type { IsEndCurrable, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { AbstractConstructor } from "../StreamClass/refactor.js"

import type { ReversibleStream } from "../ReversibleStream/interfaces.js"

import type { IPredicateStream, PredicateStreamConstructor } from "./interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

import {
	predicateStreamIsEnd,
	predicateStreamProd,
	predicateStreamCurr,
	predicateStreamNext,
	predicateStreamInitialize,
	predicateStreamDefaultIsEnd
} from "./refactor.js"

import { StreamClass } from "../StreamClass/abstract.js"
import { withSuper } from "src/refactor.js"

import { object, functional } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor
const { negate, has } = functional

const PredicateStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		defaultIsEnd: predicateStreamDefaultIsEnd,
		currGetter: predicateStreamCurr,
		baseNextIter: predicateStreamNext,
		isCurrEnd: predicateStreamIsEnd,
		isPattern: true,
		hasPosition,
		buffer
	}) as AbstractConstructor<[any], StreamClassInstance<Type> & Pattern>

export function PredicateStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): PredicateStreamConstructor<Type> {
	const baseClass = PredicateStreamBase(hasPosition, buffer)
	class predicateStream extends baseClass implements IPredicateStream<Type> {
		lookAhead: Type
		hasLookAhead: boolean
		predicate: PredicatePosition<Type>
		value: ReversibleStream<Type> & IsEndCurrable

		super: Summat
		prod: () => Type
		init: (
			input?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition<Type>
		) => IPredicateStream<Type>

		constructor(
			value?: ReversibleStream<Type> & IsEndCurrable,
			predicate?: PredicatePosition<Type>
		) {
			super(value)
			this.init(value, predicate)
		}
	}

	withSuper(predicateStream, baseClass, {
		prod: ConstDescriptor(predicateStreamProd),
		init: ConstDescriptor(predicateStreamInitialize)
	})

	return predicateStream
}

export function DelimitedStream<Type = any>(...delims: Type[]) {
	const notDelim = negate(has(new Set(delims)))
	return function (predicateStream: PredicateStreamConstructor<Type>) {
		return (input?: ReversibleStream<Type> & IsEndCurrable) =>
			new predicateStream(input, notDelim)
	}
}

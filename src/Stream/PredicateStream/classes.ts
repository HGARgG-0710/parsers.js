import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPredicatePosition } from "../../Position/interfaces.js"
import type {
	IIsEndCurrable,
	IStreamClassInstance
} from "../StreamClass/interfaces.js"

import type { Constructor } from "../StreamClass/refactor.js"

import type { IReversibleStream } from "../ReversibleStream/interfaces.js"

import type {
	IPredicateStream,
	IPredicateStreamConstructor
} from "./interfaces.js"

import type { IPattern } from "../../Pattern/interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"
import { withSuper } from "../../refactor.js"

import { object, functional } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor
const { negate, has } = functional

import { methods } from "./methods.js"
const { init, prod, ...baseMethods } = methods

const PredicateStreamBase = <Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) =>
	StreamClass<Type>({
		...baseMethods,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer
	}) as Constructor<[any], IStreamClassInstance<Type> & IPattern>

export function PredicateStream<Type = any>(
	predicate: IPredicatePosition<Type>
) {
	return function (
		hasPosition: boolean = false,
		hasBuffer: boolean = false
	): IPredicateStreamConstructor<Type> {
		const baseClass = PredicateStreamBase(hasPosition, hasBuffer)
		class predicateStream
			extends baseClass
			implements IPredicateStream<Type>
		{
			lookAhead: Type
			hasLookAhead: boolean
			predicate: IPredicatePosition<Type>
			value: IReversibleStream<Type> & IIsEndCurrable

			super: Summat
			prod: () => Type
			init: (
				input?: IReversibleStream<Type> & IIsEndCurrable
			) => IPredicateStream<Type>

			constructor(value?: IReversibleStream<Type> & IIsEndCurrable) {
				super(value)
				this.init(value)
			}
		}

		withSuper(predicateStream, baseClass, {
			prod: ConstDescriptor(prod),
			init: ConstDescriptor(init),
			predicate: ConstDescriptor(predicate)
		})

		return predicateStream
	}
}

export function DelimitedStream<Type = any>(...delims: Type[]) {
	const notDelim = negate(has(new Set(delims)))
	return function (predicateStream: IPredicateStreamConstructor<Type>) {
		return (input?: IReversibleStream<Type> & IIsEndCurrable) =>
			new predicateStream(input, notDelim)
	}
}

import type { Summat } from "@hgargg-0710/summat.ts"

import type { IFreezableBuffer } from "../../interfaces.js"
import type { IPredicatePosition } from "../Position/interfaces.js"
import type { IStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IConstructor } from "../StreamClass/refactor.js"

import type {
	IPredicateStreamConstructor,
	IUnderPredicateStream
} from "./interfaces.js"

import type { IPattern } from "src/interfaces.js"

import { StreamClass } from "../StreamClass/classes.js"
import { withSuper } from "../../refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { Autocache } from "../../internal/Autocache.js"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"

import { methods, type IPredicateStreamImpl } from "./methods.js"
const { init, prod, ...baseMethods } = methods

const PredicateStreamBase = <Type = any>(
	hasPosition = false,
	hasBuffer = false
) =>
	StreamClass<Type>({
		...baseMethods,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer
	}) as IConstructor<[any], IStreamClassInstance<Type> & IPattern>

function makePredicateStream<Type = any>(predicate: IPredicatePosition<Type>) {
	return function (
		hasPosition = false,
		hasBuffer = false
	): IPredicateStreamConstructor<Type> {
		const baseClass = PredicateStreamBase(hasPosition, hasBuffer)
		class predicateStream
			extends baseClass
			implements IPredicateStreamImpl<Type>
		{
			readonly predicate: IPredicatePosition<Type>
			readonly super: Summat

			lookAhead: Type
			hasLookAhead: boolean
			value: IUnderPredicateStream<Type>

			prod: () => Type

			init: (
				value?: IUnderPredicateStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => IPredicateStreamImpl<Type>

			constructor(
				value?: IUnderPredicateStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) {
				super(value)
				this.init(value, buffer)
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

const _PredicateStream = new Autocache(
	new ArrayMap(),
	<Type = any>([predicate, hasPosition, hasBuffer]: [
		IPredicatePosition<Type>,
		boolean?,
		boolean?
	]) => makePredicateStream(predicate)(hasPosition, hasBuffer)
)

export function PredicateStream<Type = any>(
	predicate: IPredicatePosition<Type>
) {
	return function (
		hasPosition?: boolean,
		hasBuffer?: boolean
	): IPredicateStreamConstructor<Type> {
		return _PredicateStream([predicate, hasPosition, hasBuffer])
	}
}

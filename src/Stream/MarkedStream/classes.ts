import { functional, object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"
import type { IFreezableSequence } from "../../interfaces.js"
import { Autocache } from "../../internal/Autocache.js"
import { withSuper } from "../../refactor.js"
import { DefaultEndStream } from "../classes.js"
import type { IEndableStream } from "../interfaces.js"
import {
	valueCurr,
	valueIsCurrEnd,
	valueIsCurrStart,
	type IConstructor,
	type IStreamClassInstanceImpl
} from "../StreamClass/refactor.js"
import { current } from "../utils.js"
import type { IMarkedStreamConstructor } from "./interfaces.js"
import type { IMarkedStreamImpl } from "./methods.js"
import { methods } from "./methods.js"

const { has, trivialCompose } = functional
const { ConstDescriptor } = object.descriptor
const { init, ...baseMethods } = methods

const BaseMarkedStream = <Type = any>(hasPosition = false, hasBuffer = false) =>
	DefaultEndStream<Type, IEndableStream<Type>>({
		...baseMethods,
		isCurrStart: valueIsCurrStart,
		isCurrEnd: valueIsCurrEnd,
		currGetter: valueCurr,
		hasPosition,
		hasBuffer,
		isPattern: true
	}) as IConstructor<
		[IEndableStream<Type>?],
		IStreamClassInstanceImpl<Type, IEndableStream<Type>>
	>

function makeMarkedStream<Type = any, MarkerType = any>(
	marker: (value?: IEndableStream<Type>) => MarkerType
) {
	return function (
		hasPosition = false,
		hasBuffer = false
	): IMarkedStreamConstructor<Type, MarkerType> {
		const baseClass = BaseMarkedStream<Type>(hasPosition, hasBuffer)
		class markedStream
			extends baseClass
			implements IMarkedStreamImpl<Type, MarkerType>
		{
			["constructor"]: new (
				value?: IEndableStream<Type>
			) => IMarkedStreamImpl<Type>

			value: IEndableStream<Type>
			currMarked: MarkerType

			readonly super: Summat

			marker: () => MarkerType

			init: (
				value?: IEndableStream<Type>,
				buffer?: IFreezableSequence<Type>
			) => IMarkedStreamImpl<Type, MarkerType>

			constructor(
				value?: IEndableStream<Type>,
				buffer?: IFreezableSequence<Type>
			) {
				super(value)
				this.init(value, buffer)
			}
		}

		withSuper(markedStream, baseClass, {
			marker: ConstDescriptor(marker),
			init: ConstDescriptor(init)
		})

		return markedStream
	}
}

const _MarkedStream = new Autocache(new ArrayMap(), function <
	Type = any,
	MarkerType = any
>([marker, hasPosition, hasBuffer]: [
	(value?: IEndableStream<Type>) => MarkerType,
	boolean,
	boolean
]) {
	return makeMarkedStream(marker)(hasPosition, hasBuffer)
})

export function MarkedStream<Type = any, MarkerType = any>(
	marker: (value?: IEndableStream<Type>) => MarkerType
) {
	return function (
		hasPosition = false,
		hasBuffer = false
	): IMarkedStreamConstructor<Type, MarkerType> {
		return _MarkedStream(marker, hasPosition, hasBuffer)
	}
}

// * important pre-doc: good for parsing delimited strings, like say '[a, b, c, ...]'
// * 		the `.currMarked == true` means that the current item IS A 'delims' ELEMENT
export function DelimitedStream<Type = any>(...delims: Type[]) {
	return MarkedStream<Type, boolean>(
		trivialCompose(has(new Set(delims)), current)
	)
}

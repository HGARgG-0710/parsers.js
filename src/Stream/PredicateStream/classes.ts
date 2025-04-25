import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"
import type { IFreezableSequence } from "../../interfaces.js"
import { Autocache } from "../../internal/Autocache.js"
import { withSuper } from "../../refactor.js"
import type { IPredicatePosition } from "../Position/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import type {
	IConstructor,
	IStreamClassInstanceImpl
} from "../StreamClass/refactor.js"
import type {
	IPredicateStreamConstructor,
	IUnderPredicateStream
} from "./interfaces.js"
import { methods, type IPredicateStreamImpl } from "./methods.js"

const { init, prod, ...baseMethods } = methods
const { ConstDescriptor } = object.descriptor

const PredicateStreamBase = <Type = any>(
	hasPosition = false,
	hasBuffer = false
) =>
	StreamClass<Type>({
		...baseMethods,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer
	}) as IConstructor<[any], IStreamClassInstanceImpl<Type>>

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
				buffer?: IFreezableSequence<Type>
			) => IPredicateStreamImpl<Type>

			constructor(
				value?: IUnderPredicateStream<Type>,
				buffer?: IFreezableSequence<Type>
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

import { object, type } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import { Stream } from "../../constants.js"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"
import type { IFreezableBuffer } from "../../interfaces.js"
import { Autocache } from "../../internal/Autocache.js"
import { withSuper } from "../../refactor.js"
import type {
	IPosition,
	IPredicatePosition
} from "../Position/interfaces.js"
import { directionCompare, positionNegate } from "../Position/utils.js"
import { DefaultEndStream } from "../StreamClass/classes.js"
import {
	valueCurr,
	type IConstructor,
	type IReversedStreamClassInstanceImpl
} from "../StreamClass/refactor.js"
import type {
	ILimitedStreamConstructor,
	IUnderLimitedStream
} from "./interfaces.js"
import type { ILimitedStreamImpl } from "./methods.js"
import { methods } from "./methods.js"

const { init, prod, ...baseMethods } = methods
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

const LimitedStreamBase = <Type = any>(
	hasPosition = false,
	hasBuffer = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		currGetter: valueCurr,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer
	}) as IConstructor<[any], IReversedStreamClassInstanceImpl<Type>>

function makeLimitedStream(
	from: IPosition,
	to?: IPosition
) {
	if (isNullary(to)) {
		to = from
		from = Stream.LimitedStream.NoMovementPredicate
	}

	to = positionNegate(to)

	const direction = directionCompare(from, to)

	return function <Type = any>(
		hasPosition = false,
		hasBuffer = false
	): ILimitedStreamConstructor<Type> {
		const baseClass = LimitedStreamBase<Type>(hasPosition, hasBuffer)
		class limitedStream
			extends baseClass
			implements ILimitedStreamImpl<Type>
		{
			value: IUnderLimitedStream<Type>
			lookAhead: Type
			hasLookAhead = false

			readonly super: Summat
			readonly direction: boolean
			readonly from: IPosition
			readonly to: IPosition

			prod: () => Type

			init: (
				value?: IUnderLimitedStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStreamImpl<Type>;

			["constructor"]: new (
				value?: IUnderLimitedStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStreamImpl<Type>

			constructor(
				value?: IUnderLimitedStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) {
				super(value)
				this.init(value, buffer)
			}
		}

		withSuper(limitedStream, baseClass, {
			prod: ConstDescriptor(prod),
			init: ConstDescriptor(init),
			from: ConstDescriptor(from),
			to: ConstDescriptor(to),
			direction: ConstDescriptor(direction)
		})

		return limitedStream
	}
}

const _LimitedStream = new Autocache(new ArrayMap(), function ([
	from,
	to,
	hasPosition,
	hasBuffer
]: [IPredicatePosition, IPredicatePosition | undefined, boolean, boolean]) {
	return makeLimitedStream(from, to)(hasPosition, hasBuffer)
})

export function LimitedStream<Type = any>(
	from: IPredicatePosition<Type>,
	to?: IPredicatePosition<Type>
) {
	return function (
		hasPosition = false,
		hasBuffer = false
	): ILimitedStreamConstructor<Type> {
		return _LimitedStream([from, to, hasPosition, hasBuffer])
	}
}

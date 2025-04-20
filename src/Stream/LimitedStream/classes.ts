import type { Summat } from "@hgargg-0710/summat.ts"
import { valueCurr, type IConstructor } from "../StreamClass/refactor.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPattern } from "src/interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

import type {
	ILimitedUnderStream,
	ILimitedStreamConstructor
} from "./interfaces.js"
import type { ILimitedStreamImpl } from "./refactor.js"

import type {
	IDirectionalPosition,
	IPredicatePosition
} from "../Position/interfaces.js"

import { DefaultEndStream } from "../StreamClass/classes.js"
import { withSuper } from "../../refactor.js"

import { object, type } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

import { methods } from "./methods.js"
import { directionCompare, positionNegate } from "../Position/utils.js"
const { init, prod, copy, ...baseMethods } = methods

import { Stream } from "../../constants.js"
import { Autocache } from "../../internal/Autocache.js"
import { ArrayMap } from "../../IndexMap/LinearIndexMap/classes.js"

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
	}) as IConstructor<[any], IReversedStreamClassInstance<Type> & IPattern>

function makeLimitedStream(
	from: IDirectionalPosition,
	to?: IDirectionalPosition
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
		class limitedStream extends baseClass implements ILimitedStreamImpl<Type> {
			value: ILimitedUnderStream<Type>
			lookAhead: Type
			hasLookAhead = false

			readonly super: Summat
			readonly direction: boolean
			readonly from: IDirectionalPosition
			readonly to: IDirectionalPosition

			prod: () => Type

			init: (
				value?: ILimitedUnderStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStreamImpl<Type>;

			["constructor"]: new (
				value: ILimitedUnderStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStreamImpl<Type>

			constructor(
				value?: ILimitedUnderStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) {
				super(value)
				this.init(value, buffer)
			}
		}

		withSuper(limitedStream, baseClass, {
			prod: ConstDescriptor(prod),
			init: ConstDescriptor(init),
			copy: ConstDescriptor(copy),
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

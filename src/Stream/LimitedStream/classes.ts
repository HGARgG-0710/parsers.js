import type { Summat } from "@hgargg-0710/summat.ts"
import type { IDirectionalPosition } from "../Position/interfaces.js"
import type { IConstructor } from "../StreamClass/refactor.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPattern } from "src/interfaces.js"
import type { ILimitedUnderStream, ILimitedStream } from "./interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

import { DefaultEndStream } from "../StreamClass/classes.js"
import { valuePropDelegate, withSuper } from "../../refactor.js"

import { object, type } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor
const { isNullary } = type

import { methods } from "./methods.js"
import { directionCompare, positionNegate } from "../Position/utils.js"
const { init, prod, copy, ...baseMethods } = methods

import { Stream } from "../../constants.js"

const valueCurr = valuePropDelegate("curr")

const LimitedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		currGetter: valueCurr,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: hasBuffer
	}) as IConstructor<[any], IReversedStreamClassInstance<Type> & IPattern>

export function LimitedStream(
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
		hasPosition: boolean = false,
		hasBuffer: boolean = false
	): new (value: ILimitedUnderStream<Type>) => ILimitedStream<Type> {
		const baseClass = LimitedStreamBase<Type>(hasPosition, hasBuffer)
		class limitedStream extends baseClass implements ILimitedStream<Type> {
			value: ILimitedUnderStream<Type>
			lookAhead: Type
			hasLookAhead: boolean = false

			readonly super: Summat
			readonly direction: boolean
			readonly from: IDirectionalPosition
			readonly to: IDirectionalPosition

			prod: () => Type

			init: (
				value: ILimitedUnderStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStream<Type>;

			["constructor"]: new (
				value: ILimitedUnderStream<Type>,
				buffer?: IFreezableBuffer<Type>
			) => ILimitedStream<Type>

			constructor(
				value: ILimitedUnderStream<Type>,
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

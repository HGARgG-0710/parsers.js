import type { Summat } from "@hgargg-0710/summat.ts"
import type { IDirectionalPosition } from "../Position/interfaces.js"
import type { IConstructor } from "../StreamClass/refactor.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPattern } from "src/interfaces.js"
import type { ILimitedUnderStream, ILimitedStream } from "./interfaces.js"

import { DefaultEndStream } from "../StreamClass/classes.js"
import { valuePropDelegate, withSuper } from "../../refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
import type { IFreezableBuffer } from "../../interfaces.js"
const { init, prod, copy, ...baseMethods } = methods

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

export function LimitedStream<Type = any>(
	hasPosition: boolean = false,
	hasBuffer: boolean = false
): new (
	value: ILimitedUnderStream<Type>,
	from?: IDirectionalPosition,
	to?: IDirectionalPosition
) => ILimitedStream<Type> {
	const baseClass = LimitedStreamBase<Type>(hasPosition, hasBuffer)
	class limitedStream extends baseClass implements ILimitedStream<Type> {
		value: ILimitedUnderStream<Type>
		lookAhead: Type
		hasLookAhead: boolean

		direction: boolean
		from: IDirectionalPosition
		to: IDirectionalPosition

		super: Summat

		prod: () => Type
		init: (
			value: ILimitedUnderStream<Type>,
			from?: IDirectionalPosition,
			to?: IDirectionalPosition,
			buffer?: IFreezableBuffer<Type>
		) => ILimitedStream<Type>;

		["constructor"]: new (
			value: ILimitedUnderStream<Type>,
			from?: IDirectionalPosition,
			to?: IDirectionalPosition,
			buffer?: IFreezableBuffer<Type>
		) => ILimitedStream<Type>

		constructor(
			value: ILimitedUnderStream<Type>,
			from?: IDirectionalPosition,
			to?: IDirectionalPosition,
			buffer?: IFreezableBuffer<Type>
		) {
			super(value)
			this.init(value, from, to, buffer)
		}
	}

	withSuper(limitedStream, baseClass, {
		prod: ConstDescriptor(prod),
		init: ConstDescriptor(init),
		copy: ConstDescriptor(copy)
	})

	return limitedStream
}

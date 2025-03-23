import type { Summat } from "@hgargg-0710/summat.ts"
import type { IPosition } from "../../Position/interfaces.js"
import type { Constructor } from "../StreamClass/refactor.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"
import type { ILimitedUnderStream, ILimitedStream } from "./interfaces.js"

import { DefaultEndStream } from "../StreamClass/classes.js"
import { valueCurr } from "../StreamClass/refactor.js"
import { withSuper } from "../../refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

import { methods } from "./methods.js"
const { init, prod, ...baseMethods } = methods

const LimitedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	DefaultEndStream<Type>({
		...baseMethods,
		currGetter: valueCurr,
		isPattern: true,
		hasPosition: hasPosition,
		hasBuffer: buffer
	}) as Constructor<[any], IReversedStreamClassInstance<Type> & IPattern>

export function LimitedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (
	value: ILimitedUnderStream<Type>,
	from?: IPosition,
	to?: IPosition
) => ILimitedStream<Type> {
	const baseClass = LimitedStreamBase<Type>(hasPosition, buffer)
	class limitedStream extends baseClass implements ILimitedStream<Type> {
		value: ILimitedUnderStream<Type>
		lookAhead: Type
		hasLookAhead: boolean

		direction: boolean
		from: IPosition
		to: IPosition

		super: Summat

		prod: () => Type
		init: (
			value: ILimitedUnderStream<Type>,
			from?: IPosition,
			to?: IPosition
		) => ILimitedStream<Type>

		constructor(
			value: ILimitedUnderStream<Type>,
			from?: IPosition,
			to?: IPosition
		) {
			super(value)
			this.init(value, from, to)
		}
	}

	withSuper(limitedStream, baseClass, {
		prod: ConstDescriptor(prod),
		init: ConstDescriptor(init)
	})

	return limitedStream
}

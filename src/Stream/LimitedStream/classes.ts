import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../../Position/interfaces.js"
import type { AbstractConstructor } from "../StreamClass/refactor.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { LimitedUnderStream, LimitedStream as ILimitedStream } from "./interfaces.js"

import { DefaultEndStream } from "../StreamClass/abstract.js"
import { valueCurr } from "../StreamClass/refactor.js"
import {
	limitedStreamInitialize,
	limitedStreamProd,
	limitedStreamIsEnd,
	limitedStreamNext,
	limitedStreamPrev,
	limitedStreamIsStart
} from "./refactor.js"

import { withSuper } from "src/refactor.js"

import { object } from "@hgargg-0710/one"
const { ConstDescriptor } = object.descriptor

const LimitedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	DefaultEndStream<Type>({
		currGetter: valueCurr,
		baseNextIter: limitedStreamNext,
		basePrevIter: limitedStreamPrev,
		isCurrEnd: limitedStreamIsEnd,
		isCurrStart: limitedStreamIsStart,
		isPattern: true,
		hasPosition,
		buffer
	}) as AbstractConstructor<[any], ReversedStreamClassInstance<Type> & Pattern>

export function LimitedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (
	value: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) => ILimitedStream<Type> {
	const baseClass = LimitedStreamBase<Type>(hasPosition, buffer)
	class limitedStream extends baseClass implements ILimitedStream<Type> {
		value: LimitedUnderStream<Type>
		lookAhead: Type
		hasLookAhead: boolean

		direction: boolean
		from: Position
		to: Position

		super: Summat

		prod: () => Type
		init: (
			value: LimitedUnderStream<Type>,
			from?: Position,
			to?: Position
		) => ILimitedStream<Type>

		constructor(value: LimitedUnderStream<Type>, from?: Position, to?: Position) {
			super(value)
			this.init(value, from, to)
		}
	}

	withSuper(limitedStream, baseClass, {
		prod: ConstDescriptor(limitedStreamProd),
		init: ConstDescriptor(limitedStreamInitialize)
	})

	return limitedStream
}

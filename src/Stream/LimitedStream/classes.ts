import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../../Position/interfaces.js"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type {
	LimitedUnderStream,
	LimitedStream as EffectiveLimitedStream
} from "./interfaces.js"

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
	}) as PatternReversedStreamConstructor<Type>

export function LimitedStream<Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
): new (
	value: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) => EffectiveLimitedStream<Type> {
	const baseClass = LimitedStreamBase<Type>(hasPosition, buffer)
	class limitedStream extends baseClass implements EffectiveLimitedStream<Type> {
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
		) => EffectiveLimitedStream<Type>

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

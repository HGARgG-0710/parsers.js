import type { Summat } from "@hgargg-0710/summat.ts"
import type { Position } from "../../Position/interfaces.js"
import type { PatternReversedStreamConstructor } from "../StreamClass/interfaces.js"
import type {
	LimitedUnderStream,
	LimitedStream as EffectiveLimitedStream
} from "./interfaces.js"

import { valueCurr, valueDefaultIsEnd } from "../../Pattern/methods.js"
import {
	limitedStreamInitialize,
	limitedStreamProd,
	limitedStreamIsEnd,
	limitedStreamNext,
	limitedStreamPrev,
	limitedStreamIsStart
} from "./methods.js"

import { StreamClass } from "../StreamClass/classes.js"
import { extendPrototype } from "../../utils.js"

const LimitedStreamBase = <Type = any>(
	hasPosition: boolean = false,
	buffer: boolean = false
) =>
	StreamClass<Type>({
		currGetter: valueCurr,
		baseNextIter: limitedStreamNext,
		basePrevIter: limitedStreamPrev,
		isCurrEnd: limitedStreamIsEnd,
		isCurrStart: limitedStreamIsStart,
		defaultIsEnd: valueDefaultIsEnd,
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

	extendPrototype(limitedStream, {
		super: { value: baseClass.prototype },
		prod: { value: limitedStreamProd },
		init: { value: limitedStreamInitialize }
	})

	return limitedStream
}

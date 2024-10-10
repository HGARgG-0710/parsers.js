import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Position } from "../../Position/interfaces.js"
import type { LimitedUnderStream, EffectiveLimitedStream } from "./interfaces.js"

import {
	effectiveLimitedStreamInitialize,
	effectiveLimitedStreamProd,
	effectiveLimitedStreamIsEnd,
	effectiveLimitedStreamNext,
	effectiveLimitedStreamPrev,
	effectiveLimitedStreamIsStart
} from "./methods.js"
import { inputCurr, inputDefaultIsEnd } from "../StreamClass/methods.js"

import { StreamClass } from "../StreamClass/classes.js"

import { function as _f } from "@hgargg-0710/one"
const { cached } = _f

const LimitedStreamBase = cached((hasPosition: boolean = false) =>
	StreamClass({
		currGetter: inputCurr,
		baseNextIter: effectiveLimitedStreamNext,
		basePrevIter: effectiveLimitedStreamPrev,
		isCurrEnd: effectiveLimitedStreamIsEnd,
		isCurrStart: effectiveLimitedStreamIsStart,
		defaultIsEnd: inputDefaultIsEnd,
		hasPosition
	})
) as (hasPosition?: boolean) => new () => ReversedStreamClassInstance

export function LimitedStream<Type = any>(
	hasPosition: boolean = false
): new (
	input?: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) => EffectiveLimitedStream<Type> {
	const baseClass = LimitedStreamBase(hasPosition)
	class limitedStream extends baseClass implements EffectiveLimitedStream<Type> {
		input: LimitedUnderStream<Type>
		lookAhead: Type
		hasLookAhead: boolean

		direction: boolean
		from: Position
		to: Position

		super: Summat

		prod: () => Type
		init: (
			input?: LimitedUnderStream<Type>,
			from?: Position,
			to?: Position
		) => EffectiveLimitedStream<Type>

		constructor(input?: LimitedUnderStream<Type>, from?: Position, to?: Position) {
			super()
			this.init(input, from, to)
		}
	}

	Object.defineProperties(limitedStream.prototype, {
		super: { value: baseClass.prototype },
		prod: { value: effectiveLimitedStreamProd },
		init: { value: effectiveLimitedStreamInitialize }
	})

	return limitedStream
}

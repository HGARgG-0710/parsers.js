import type { Position } from "../PositionalStream/Position/interfaces.js"
import type {
	LimitedUnderStream,
	EffectiveLimitedStream,
	BoundableStream
} from "./interfaces.js"

import {
	effectiveLimitedStreamInitialize,
	effectiveLimitedStreamProd,
	limitStream,
	effectiveLimitedStreamIsEnd,
	effectiveLimitedStreamNext,
	effectiveLimitedStreamPrev,
	effectiveLimitedStreamIsStart
} from "./methods.js"
import { underStreamCurr, underStreamDefaultIsEnd } from "../UnderStream/methods.js"

import { StreamClass } from "../StreamClass/classes.js"

export const LimitedStreamBase = StreamClass({
	currGetter: underStreamCurr,
	baseNextIter: effectiveLimitedStreamNext,
	basePrevIter: effectiveLimitedStreamPrev,
	isCurrEnd: effectiveLimitedStreamIsEnd,
	isCurrStart: effectiveLimitedStreamIsStart,
	defaultIsEnd: underStreamDefaultIsEnd
})

export class LimitedStream<Type = any>
	extends LimitedStreamBase
	implements EffectiveLimitedStream<Type>
{
	input: LimitedUnderStream<Type>
	pos: number = 0
	lookAhead: Type
	from: Position
	to: Position

	direction: boolean
	hasLookAhead: boolean

	init: (
		input?: LimitedUnderStream<Type>,
		from?: Position,
		to?: Position
	) => EffectiveLimitedStream<Type>

	prod: () => Type
	prev: () => Type
	isCurrStart: () => boolean

	rewind: () => Type

	constructor(input?: LimitedUnderStream<Type>, from?: Position, to?: Position) {
		super()
		this.init(input, from, to)
		super.init()
	}
}

Object.defineProperties(LimitedStream.prototype, {
	limit: { value: limitStream },
	prod: { value: effectiveLimitedStreamProd },
	init: { value: effectiveLimitedStreamInitialize }
})

export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	return navigable as BoundableStream<Type>
}

import type { Summat } from "@hgargg-0710/summat.ts"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Position } from "../../Position/interfaces.js"
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
import { inputCurr, inputDefaultIsEnd } from "../StreamClass/methods.js"

import { StreamClass } from "../StreamClass/classes.js"

const LimitedStreamBase = StreamClass({
	currGetter: inputCurr,
	baseNextIter: effectiveLimitedStreamNext,
	basePrevIter: effectiveLimitedStreamPrev,
	isCurrEnd: effectiveLimitedStreamIsEnd,
	isCurrStart: effectiveLimitedStreamIsStart,
	defaultIsEnd: inputDefaultIsEnd
}) as new () => ReversedStreamClassInstance

export class LimitedStream<Type = any>
	extends LimitedStreamBase
	implements EffectiveLimitedStream<Type>
{
	input: LimitedUnderStream<Type>
	lookAhead: Type
	hasLookAhead: boolean
	pos: number = 0

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

Object.defineProperties(LimitedStream.prototype, {
	super: { value: LimitedStreamBase.prototype },
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

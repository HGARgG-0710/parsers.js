import type { DualPosition } from "../PositionalStream/Position/interfaces.js"
import type {
	LimitedUnderStream,
	EffectiveLimitedStream,
	BoundableStream
} from "./interfaces.js"

import { effectiveLimitedStreamProd, limitStream } from "./methods.js"
import { effectiveLimitedStreamIsEnd, limitedStreamNavigate } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { underStreamCurr, underStreamDefaultIsEnd } from "../UnderStream/methods.js"

import { isNavigable, uniNavigate } from "../NavigableStream/utils.js"
import { effectiveLimitedStreamNext } from "./methods.js"
import { effectiveLimitedStreamPrev } from "./methods.js"
import { effectiveLimitedStreamIsStart } from "./methods.js"
import { Inputted } from "../UnderStream/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

import { boolean } from "@hgargg-0710/one"
const { T } = boolean

export const LimitedStreamClass = StreamClass({
	currGetter: underStreamCurr,
	baseNextIter: effectiveLimitedStreamNext,
	basePrevIter: effectiveLimitedStreamPrev,
	isCurrEnd: effectiveLimitedStreamIsEnd,
	isCurrStart: effectiveLimitedStreamIsStart,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function LimitedStream<Type = any>(
	input: LimitedUnderStream<Type>,
	[from, to]: DualPosition
): EffectiveLimitedStream<Type> {
	if (to === undefined) {
		to = from
		from = T // explanation: the 'from = T' will cause expression 'while (!from(stream)) stream.next()' become 'while (false) stream.next()', essentially being a no-op;
	}
	uniNavigate(input, from)

	const result = Inputted(LimitedStreamClass(), input)
	result.pos = 0
	result.from = from
	result.to = to
	result.navigate = isNavigable(input) ? limitedStreamNavigate<Type> : null
	result[Symbol.iterator] = streamIterator<Type>
	result.limit = limitStream<Type>
	result.hasLookAhead = false
	result.prod = effectiveLimitedStreamProd<Type>

	return result as EffectiveLimitedStream<Type>
}

export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	return navigable as BoundableStream<Type>
}

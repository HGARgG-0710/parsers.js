import { boolean } from "@hgargg-0710/one"
const { T } = boolean

import type { DualPosition } from "../PositionalStream/Position/interfaces.js"
import type { LimitedUnderStream, LimitedStream, BoundableStream } from "./interfaces.js"

import { limitStream } from "./methods.js"
import { limitedStreamNavigate } from "./methods.js"
import { limitedStreamIsEnd } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { underStreamCurr, underStreamDefaultIsEnd } from "../UnderStream/methods.js"

import { isNavigable, uniNavigate } from "../NavigableStream/utils.js"
import { limitedStreamNext } from "./methods.js"
import { limitedStreamPrev } from "./methods.js"
import { limitedStreamIsStart } from "./methods.js"
import { Inputted } from "../UnderStream/classes.js"
import { StreamClass } from "../StreamClass/classes.js"

export const LimitedStreamClass = StreamClass({
	currGetter: underStreamCurr,
	baseNextIter: limitedStreamNext,
	basePrevIter: limitedStreamPrev,
	isCurrEnd: limitedStreamIsEnd,
	isCurrStart: limitedStreamIsStart,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function LimitedStream<Type = any>(
	input: LimitedUnderStream<Type>,
	[from, to]: DualPosition
): LimitedStream<Type> {
	if (!to) {
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
	return result as LimitedStream<Type>
}

export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	return navigable as BoundableStream<Type>
}

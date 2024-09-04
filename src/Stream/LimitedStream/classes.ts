import {
	uniNavigate,
	ForwardStreamIterationHandler,
	StreamCurrGetter,
	limitedStreamNavigate
} from "_src/types.js"
import { limitStream } from "./methods.js"
import type { Started } from "../ReversibleStream/interfaces.js"
import type { Prevable } from "../interfaces.js"
import { isNavigable } from "../NavigableStream/utils.js"
import { limitedStreamIsEnd } from "../PreBasicStream/methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import { underStreamCurr, underStreamNext } from "../UnderStream/methods.js"
import type { LimitedUnderStream, LimitedStream, BoundableStream } from "./interfaces.js"

export function LimitedStream<Type = any>(
	initialStream: LimitedUnderStream<Type>,
	[from, to]: DualPosition,
	startPos: Position = 0
): LimitedStream<Type> {
	if (!to) {
		to = from
		from = null
	}
	if (from !== null)
		uniNavigate(initialStream as LimitedUnderStream<Type> & Prevable & Started, from)
	return ForwardStreamIterationHandler<Type>(
		StreamCurrGetter(
			{
				pos: startPos,
				to,
				input: initialStream,
				navigate: isNavigable(initialStream) ? limitedStreamNavigate<Type> : null,
				limit: limitStream<Type>,
				[Symbol.iterator]: streamIterator<Type>
			},
			underStreamCurr<Type>
		),
		underStreamNext<Type>,
		limitedStreamIsEnd<Type>
	) as LimitedStream<Type>
}
export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	navigable[Symbol.iterator] = streamIterator<Type>
	return navigable as BoundableStream<Type>
}

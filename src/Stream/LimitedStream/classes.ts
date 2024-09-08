import { boolean } from "@hgargg-0710/one"
const { T } = boolean

import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import type { LimitedUnderStream, LimitedStream, BoundableStream } from "./interfaces.js"

import {
	BackwardStreamIterationHandler,
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"

import { limitStream } from "./methods.js"
import { limitedStreamNavigate } from "./methods.js"
import { limitedStreamIsEnd } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { underStreamCurr } from "../UnderStream/methods.js"

import { isNavigable, uniNavigate } from "../NavigableStream/utils.js"
import { limitedStreamNext } from "./methods.js"
import { limitedStreamPrev } from "./methods.js"
import { limitedStreamIsStartGetter } from "./methods.js"

export function LimitedStream<Type = any>(
	initialStream: LimitedUnderStream<Type>,
	[from, to]: DualPosition
): LimitedStream<Type> {
	if (!to) {
		to = from
		from = T
	}
	if (from !== null) uniNavigate(initialStream, from)
	return BackwardStreamIterationHandler<Type>(
		ForwardStreamIterationHandler<Type>(
			StreamCurrGetter<Type>(
				{
					pos: 0,
					from,
					to,
					input: initialStream,
					navigate: isNavigable(initialStream)
						? limitedStreamNavigate<Type>
						: null,
					limit: limitStream<Type>,
					[Symbol.iterator]: streamIterator<Type>
				},
				underStreamCurr<Type>
			),
			limitedStreamNext<Type>,
			limitedStreamIsEnd<Type>
		),
		limitedStreamPrev<Type>,
		limitedStreamIsStartGetter
	) as LimitedStream<Type>
}

export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	navigable[Symbol.iterator] = streamIterator<Type>
	return navigable as BoundableStream<Type>
}

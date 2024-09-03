import { underStreamCurr, underStreamNext } from "./UnderStream.js"
import { PositionalStream } from "./PositionalStream.js"
import { type BasicStream, limitedStreamIsEnd } from "./BasicStream.js"
import type { Inputted } from "src/interfaces/Inputted.js"
import type { DualPosition, Position } from "./Position.js"
import { limitedStreamNavigate } from "./NavigableStream.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "./StreamIterationHandler.js"
import { type IterableStream, streamIterator } from "./IterableStream.js"
import type { Limitable } from "src/interfaces/Limitable.js"
import type { BaseNextable } from "src/interfaces/BaseIterable.js"
import type { IsEndCurrable } from "src/interfaces/BoundCheckable.js"
import { isNavigable } from "src/interfaces/Navigable.js"

export type LimitedUnderStream<Type = any> = PositionalStream<Type> &
	BaseNextable<Type> &
	IsEndCurrable

export interface LimitableStream<Type = any>
	extends BasicStream<Type>,
		Limitable<BasicStream<Type>, DualPosition> {}

export interface BoundableStream<Type = any>
	extends LimitableStream<Type>,
		LimitedUnderStream<Type>,
		IterableStream<Type> {}

export interface LimitedStream<Type = any>
	extends BoundableStream<Type>,
		Inputted<LimitedUnderStream<Type>>,
		IterableStream<Type>,
		BaseNextable<Type>,
		IsEndCurrable {}

export function LimitedStream<Type = any>(
	initialStream: LimitedUnderStream<Type>,
	[from, to]: DualPosition,
	startPos: Position = 0
): LimitedStream<Type> {
	if (!to) {
		to = from
		from = null
	}
	if (from !== null) initialStream.navigate(from)
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

export function limitStream<Type = any>(this: BoundableStream<Type>, dual: DualPosition) {
	return LimitedStream<Type>(this, dual)
}

export function LimitableStream<Type = any>(
	navigable: LimitedUnderStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream<Type>
	navigable[Symbol.iterator] = streamIterator<Type>
	return navigable as BoundableStream<Type>
}

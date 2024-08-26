import { underStreamCurr } from "./UnderStream.js"
import { underStreamNext } from "./UnderStream.js"
import { PositionalStream } from "./PositionalStream.js"
import { limitedStreamIsEnd, type BasicStream } from "./BasicStream.js"
import { type Position } from "./Position.js"
import { limitedStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import { StreamEndingHandler } from "./StreamEndingHandler.js"

export interface LimitableStream<Type = any> extends BasicStream<Type> {
	limit(from: Position, to?: Position): BasicStream<Type>
}

export function LimitedStream<Type = any>(
	initialStream: NavigableStream<Type> & PositionalStream<Type>,
	from: Position,
	to?: Position
): NavigableStream<Type> & LimitableStream<Type> & PositionalStream<Type> {
	if (!to) {
		to = from
		from = null
	}
	if (from !== null) initialStream.navigate(from)
	return StreamEndingHandler(
		{
			pos: 0,
			to,
			input: initialStream,
			navigate: limitedStreamNavigate,
			next: underStreamNext,
			curr: underStreamCurr,
			limit: limitStream
		},
		limitedStreamIsEnd
	) as NavigableStream<Type> & LimitableStream<Type> & PositionalStream<Type>
}

export function limitStream<Type = any>(from: Position, to?: Position) {
	return LimitedStream<Type>(this, from, to)
}

export function LimitableStream<Type = any>(
	navigable: NavigableStream<Type> & PositionalStream<Type>
): LimitableStream<Type> & NavigableStream<Type> & PositionalStream<Type> {
	navigable.limit = limitStream
	return navigable as LimitableStream<Type> &
		NavigableStream<Type> &
		PositionalStream<Type>
}

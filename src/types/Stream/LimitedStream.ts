import { underStreamCurr } from "./UnderStream.js"
import { underStreamNext } from "./UnderStream.js"
import { PositionalStream } from "./PositionalStream.js"
import { limitedStreamIsEnd, type BasicStream, type Inputted } from "./BasicStream.js"
import { type Position } from "./Position.js"
import { limitedStreamNavigate, type NavigableStream } from "./NavigableStream.js"
import { StreamCurrGetter, StreamEndingHandler } from "./StreamEndingHandler.js"

export interface LimitableStream<Type = any> extends BasicStream<Type> {
	limit(from: Position, to?: Position): BasicStream<Type>
}

export interface LimitedStream<Type = any>
	extends BoundableStream<Type>,
		Inputted<NavigableStream<Type> & PositionalStream<Type>> {}

export interface BoundableStream<Type = any>
	extends LimitableStream<Type>,
		NavigableStream<Type>,
		PositionalStream<Type> {}

export function LimitedStream<Type = any>(
	initialStream: NavigableStream<Type> & PositionalStream<Type>,
	from: Position,
	to?: Position
): LimitedStream<Type> {
	if (!to) {
		to = from
		from = null
	}
	if (from !== null) initialStream.navigate(from)
	return StreamEndingHandler(
		StreamCurrGetter(
			{
				pos: 0,
				to,
				input: initialStream,
				navigate: limitedStreamNavigate<Type>,
				next: underStreamNext,
				limit: limitStream
			},
			underStreamCurr
		),
		limitedStreamIsEnd
	) as LimitedStream<Type>
}

export function limitStream<Type = any>(
	this: BoundableStream<Type>,
	from: Position,
	to?: Position
) {
	return LimitedStream<Type>(this, from, to)
}

export function LimitableStream<Type = any>(
	navigable: NavigableStream<Type> & PositionalStream<Type>
): BoundableStream<Type> {
	navigable.limit = limitStream
	return navigable as BoundableStream<Type>
}

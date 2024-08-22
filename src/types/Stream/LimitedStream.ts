import { underStreamCurr } from "./UnderStream.js"
import { underStreamNext } from "./UnderStream.js"
import { PositionalStream } from "./PositionalStream.js"
import type { BasicStream } from "./BasicStream.js"
import { type Position, positionCheck, positionConvert } from "./Position.js"
import type { NavigableStream } from "./NavigableStream.js"
import { isNumber } from "src/misc.js"
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

export function limitedStreamNavigate(position: Position) {
	position = positionConvert(position)
	return this.input.navigate(
		isNumber(position)
			? (positionConvert(this.input.pos) as number) + position
			: position
	)
}
export function limitedStreamIsEnd() {
	return this.input.isEnd || !positionCheck(this.input, this.to)
}

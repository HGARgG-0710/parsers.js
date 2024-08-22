import { underStreamIsEnd } from "./UnderStream.js"
import { underStreamCurr } from "./UnderStream.js"
import type { BasicStream } from "./BasicStream.js"
import type { Position } from "./Position.js"

export interface PositionalStream<Type = any, PosType = any> extends BasicStream<Type> {
	pos: Position<PosType>
}

export function PositionalStream<Type = any>(
	input: BasicStream<Type>
): PositionalStream<Type> {
	return Object.defineProperty(
		{
			pos: 0,
			input,
			next: positionalStreamNext,
			curr: underStreamCurr
		},
		"isEnd",
		{
			get: underStreamIsEnd
		}
	) as unknown as PositionalStream<Type>
}
export function positionalStreamNext(this: BasicStream) {
	if (!this.input.isEnd) ++this.pos
	return this.input.next()
}

import { underStreamFinish, underStreamIsEnd } from "./UnderStream.js"
import { underStreamCurr } from "./UnderStream.js"
import type { BasicStream, Inputted } from "./BasicStream.js"
import type { Position } from "./Position.js"
import { StreamCurrGetter, StreamEndingHandler } from "./StreamEndingHandler.js"
import { positionalStreamNext } from "./StreamIterable.js"
import { isFinishableStream } from "main.js"

export interface PositionalStream<Type = any, PosType extends Position = Position>
	extends BasicStream<Type> {
	pos: PosType
}

export interface PositionalInputtedStream<Type = any, PosType extends Position = Position>
	extends PositionalStream<Type, PosType>,
		Inputted<BasicStream<Type>> {}

export function PositionalStream<Type = any>(
	input: BasicStream<Type>
): PositionalInputtedStream<Type> {
	return StreamEndingHandler(
		StreamCurrGetter(
			{
				pos: 0,
				input,
				next: positionalStreamNext<Type>,
				finish: isFinishableStream(input) ? underStreamFinish<Type> : null
			},
			underStreamCurr<Type>
		),
		underStreamIsEnd<Type>
	) as PositionalInputtedStream<Type>
}

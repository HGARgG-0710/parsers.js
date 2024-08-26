import { underStreamFinish, underStreamIsEnd } from "./UnderStream.js"
import { underStreamCurr } from "./UnderStream.js"
import type { BasicStream, Inputted } from "./BasicStream.js"
import type { Position } from "./Position.js"
import { StreamEndingHandler } from "./StreamEndingHandler.js"
import { positionalStreamNext } from "./PreBasicStream.js"
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
		{
			pos: 0,
			input,
			next: positionalStreamNext,
			curr: underStreamCurr,
			finish: isFinishableStream(input) ? underStreamFinish : null
		},
		underStreamIsEnd
	) as PositionalInputtedStream<Type>
}

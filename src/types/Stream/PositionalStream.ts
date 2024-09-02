import { underStreamFinish, underStreamIsEnd, underStreamCurr } from "./UnderStream.js"
import type { BasicStream } from "./BasicStream.js"
import type { Inputted } from "src/interfaces/Inputted.js"
import type { Position } from "./Position.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "./StreamIterationHandler.js"
import { positionalStreamNext } from "./BasicStream.js"
import { isFinishable } from "src/interfaces.js"
import { streamIterator, type IterableStream } from "./IterableStream.js"
import type { Posed } from "src/interfaces/Posed.js"
import type { BaseNextable } from "src/interfaces/BaseIterable.js"
import type { IsEndCurrable } from "src/interfaces/BoundCheckable.js"

export interface PositionalStream<Type = any, PosType extends Position = Position>
	extends BasicStream<Type>,
		Posed<PosType> {}

export interface PositionalInputtedStream<Type = any, PosType extends Position = Position>
	extends PositionalStream<Type, PosType>,
		Inputted<BasicStream<Type>>,
		IterableStream<Type>,
		BaseNextable<Type>,
		IsEndCurrable {}

export function PositionalStream<Type = any>(
	input: BasicStream<Type>
): PositionalInputtedStream<Type> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter(
			{
				pos: 0,
				input,
				finish: isFinishable(input) ? underStreamFinish<Type> : null,
				[Symbol.iterator]: streamIterator<Type>
			},
			underStreamCurr<Type>
		),
		positionalStreamNext<Type>,
		underStreamIsEnd<Type>
	) as PositionalInputtedStream<Type>
}

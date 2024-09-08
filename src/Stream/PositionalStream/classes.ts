import { isFinishable } from "../FinishableStream/utils.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import { positionalStreamNext } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"
import {
	underStreamFinish,
	underStreamCurr,
	underStreamIsEnd
} from "../UnderStream/methods.js"
import type { PositionalInputtedStream } from "./interfaces.js"

export function PositionalStream<Type = any>(
	input: BasicStream<Type>
): PositionalInputtedStream<Type> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter<Type>(
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

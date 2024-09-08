import { isRewindable } from "../RewindableStream/utils.js"
import { uniFinish } from "../FinishableStream/utils.js"
import { streamIterator } from "../IterableStream/methods.js"
import {
	underStreamRewind,
	underStreamCurr,
	underStreamPrev,
	underStreamIsStart,
	underStreamNext,
	underStreamIsEnd
} from "../UnderStream/methods.js"
import type { ReversibleStream, ReversedStream } from "./interfaces.js"

import {
	BackwardStreamIterationHandler,
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"

export function ReversedStream<Type = any>(
	input: ReversibleStream<Type>
): ReversedStream<Type> {
	uniFinish(input)
	return BackwardStreamIterationHandler<Type>(
		ForwardStreamIterationHandler<Type>(
			StreamCurrGetter<Type>(
				{
					input,
					finish: isRewindable(input) ? underStreamRewind<Type> : null,
					[Symbol.iterator]: streamIterator<Type>
				},
				underStreamCurr<Type>
			),
			underStreamPrev<Type>,
			underStreamIsStart<Type>
		),
		underStreamNext<Type>,
		underStreamIsEnd<Type>
	) as ReversedStream<Type>
}

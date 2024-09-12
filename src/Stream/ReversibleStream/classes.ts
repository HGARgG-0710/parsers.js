import { isRewindable } from "../RewindableStream/utils.js"
import { uniFinish } from "../FinishableStream/utils.js"
import { streamIterator } from "../IterableStream/methods.js"
import {
	underStreamRewind,
	underStreamCurr,
	underStreamPrev,
	underStreamIsStart,
	underStreamNext,
	underStreamIsEnd,
	underStreamDefaultIsStart
} from "../UnderStream/methods.js"
import type { ReversibleStream, ReversedStream } from "./interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"

export const ReversedStreamClass = StreamClass({
	currGetter: underStreamCurr,
	baseNextIter: underStreamPrev,
	basePrevIter: underStreamNext,
	isCurrEnd: underStreamIsStart,
	isCurrStart: underStreamIsEnd,
	defaultIsEnd: underStreamDefaultIsStart
})

export function ReversedStream<Type = any>(
	input: ReversibleStream<Type>
): ReversedStream<Type> {
	uniFinish(input)
	const result = Inputted(ReversedStreamClass(), input)
	result.finish = isRewindable(input) ? underStreamRewind<Type> : null
	result[Symbol.iterator] = streamIterator<Type>
	return result as ReversedStream<Type>
}

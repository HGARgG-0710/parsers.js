import { isFinishable } from "../FinishableStream/utils.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import { positionalStreamNext } from "./methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { StreamClass } from "../StreamClass/classes.js"
import {
	underStreamFinish,
	underStreamCurr,
	underStreamIsEnd
} from "../UnderStream/methods.js"
import type { PositionalInputtedStream } from "./interfaces.js"
import { Inputted } from "../UnderStream/classes.js"

export const PositionalStreamClass = StreamClass({
	isCurrEnd: underStreamIsEnd,
	baseNextIter: positionalStreamNext,
	currGetter: underStreamCurr
})

export function PositionalStream<Type = any>(
	input: BasicStream<Type>
): PositionalInputtedStream<Type> {
	const result = Inputted(PositionalStreamClass(), input)
	result.pos = 0
	result.finish = isFinishable(input) ? underStreamFinish<Type> : null
	result[Symbol.iterator] = streamIterator<Type>
	return result as PositionalInputtedStream<Type>
}

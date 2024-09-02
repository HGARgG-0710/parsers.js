import {
	underStreamCurr,
	underStreamIsEnd,
	underStreamIsStart,
	underStreamRewind,
	underStreamNext,
	underStreamPrev
} from "./UnderStream.js"
import type { Inputted } from "src/interfaces/Inputted.js"
import type { TreeStream } from "./TreeStream.js"
import { isRewindable } from "src/interfaces/Rewindable.js"
import { unifinish } from "./FinishableStream.js"
import type { InputStream } from "./InputStream.js"
import { type IterableStream, streamIterator } from "./IterableStream.js"
import type { PreBasicStream } from "./PreBasicStream.js"
import { StreamCurrGetter } from "./StreamIterationHandler.js"
import type { StartedStream } from "./StartedStream.js"
import type { Prevable } from "src/interfaces/BaseIterable.js"

export interface ReversibleStream<Type = any>
	extends StartedStream<Type>,
		Prevable<Type> {}

export interface ReversedStream<Type = any>
	extends ReversibleStream<Type>,
		Inputted<ReversibleStream<Type>>,
		IterableStream<Type> {}

export function ReversedStream<Type = any>(
	input: ReversibleStream<Type>
): ReversedStream<Type> {
	unifinish(input)
	return StreamCurrGetter(
		Object.defineProperties(
			{
				input,
				next: underStreamPrev<Type>,
				prev: underStreamNext<Type>,
				finish: isRewindable(input) ? underStreamRewind<Type> : null,
				[Symbol.iterator]: streamIterator<Type>
			},
			{
				isEnd: {
					get: underStreamIsStart<Type>
				},
				isStart: {
					get: underStreamIsEnd<Type>
				}
			}
		) as unknown as PreBasicStream<Type>,
		underStreamCurr<Type>
	) as ReversedStream<Type>
}

export function inputStreamPrev<Type = any>(this: InputStream<Type>) {
	return this.input[--this.pos]
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	this.isEnd = false
	if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()
	return this.curr
}

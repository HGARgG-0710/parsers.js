import {
	underStreamCurr,
	underStreamIsEnd,
	underStreamIsStart,
	underStreamRewind
} from "./UnderStream.js"
import { underStreamNext, underStreamPrev } from "./UnderStream.js"
import type { BasicStream, Inputted } from "./BasicStream.js"
import type { TreeStream } from "./TreeStream.js"
import { isRewindableStream } from "./RewindableStream.js"
import { unifinish } from "./FinishableStream.js"
import {
	InputStream,
	StreamCurrGetter,
	streamIterator,
	type IterableStream,
	type PreBasicStream
} from "main.js"

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
				finish: isRewindableStream(input) ? underStreamRewind<Type> : null,
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
		underStreamCurr
	) as ReversedStream<Type>
}

export interface ReversedStream<Type = any>
	extends ReversibleStream<Type>,
		Inputted<ReversibleStream<Type>>,
		IterableStream<Type> {}

export interface ReversibleStream<Type = any>
	extends BasicStream<Type>,
		StartedStream<Type> {
	prev(): Type
}

export interface StartedStream<Type = any> extends BasicStream<Type> {
	isStart: boolean
}

export function inputStreamtPrev<Type = any>(this: InputStream<Type>) {
	const prev = this.pos
	this.pos -= +!this.isStart
	return this.input[prev]
}

export function inputStreamIsStart<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker, curr } = this
	const next = curr

	if (this.isEnd) this.isEnd = false

	if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()

	return next
}

export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}

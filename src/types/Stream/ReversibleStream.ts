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

export function ReversedStream<Type = any>(
	input: ReversibleStream<Type>
): ReversedStream<Type> {
	unifinish(input)
	return Object.defineProperties(
		{
			input,
			next: underStreamPrev,
			prev: underStreamNext,
			curr: underStreamCurr,
			finish: isRewindableStream(input) ? underStreamRewind : null
		},
		{
			isEnd: {
				get: underStreamIsStart
			},
			isStart: {
				get: underStreamIsEnd
			}
		}
	) as unknown as ReversedStream<Type>
}

export interface ReversedStream<Type = any>
	extends ReversibleStream<Type>,
		Inputted<ReversibleStream<Type>> {}

export interface ReversibleStream<Type = any>
	extends BasicStream<Type>,
		StartedStream<Type> {
	prev(): Type
}

export interface StartedStream<Type = any> extends BasicStream<Type> {
	isStart: boolean
}

export function inputStreamtPrev() {
	const prev = this.pos
	// ! AGAIN: THIS IS __supposed__ to be used with something that is a PositionalStream with NUMBER '.pos' (this has to be given its own name...); REMOVE the explicit number-conversion...;
	this.pos -= +!this.isStart
	return this.input[prev]
}

export function inputStreamIsStart() {
	return !this.pos
}

export function treeStreamPrev<Type = any>(this: TreeStream<Type>) {
	const { walker } = this
	const next = walker.current

	if (this.isEnd) this.isEnd = false
	else if (walker.isSiblingBefore()) walker.goPrevLast()
	else if (walker.isParent()) walker.popChild()

	return next
}

export function treeStreamIsStartGetter<Type = any>(this: TreeStream<Type>) {
	return !this.walker.isParent()
}

import type {
	BaseUnderStream,
	Inputted,
	IsCurrableUnderStream,
	UnderStream
} from "./interfaces.js"

import type { BasicStream } from "../BasicStream/interfaces.js"

import type { Finishable } from "../FinishableStream/interfaces.js"
import type { ReversibleStream, StartedStream } from "../ReversibleStream/interfaces.js"
import type { Rewindable } from "../RewindableStream/interfaces.js"
import type { EndableStream } from "../StreamClass/interfaces.js"

export function underStreamPrev<Type = any>(this: UnderStream<ReversibleStream, Type>) {
	return this.input.prev()
}

export function underStreamNext<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.next()
}

export function underStreamCurr<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.curr
}

export function underStreamIsEnd<Type = any>(this: BaseUnderStream<EndableStream, Type>) {
	return this.input.isCurrEnd()
}

export function underStreamIsStart<Type = any>(
	this: IsCurrableUnderStream<BasicStream, Type>
) {
	return this.input.isCurrStart()
}

export function underStreamRewind<Type = any>(this: Inputted<Rewindable<Type>>) {
	return this.input.rewind()
}

export function underStreamFinish<Type = any>(this: Inputted<Finishable<Type>>) {
	return this.input.finish()
}

export function underStreamDefaultIsEnd<Type = any>(
	this: UnderStream<BasicStream, Type>
) {
	return this.input.isEnd
}

export function underStreamDefaultIsStart<Type = any>(
	this: UnderStream<StartedStream, Type>
) {
	return this.input.isStart
}

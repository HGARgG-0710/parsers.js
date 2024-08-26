import type { RewindableStream } from "./RewindableStream.js"
import type { BasicStream, Inputted } from "./BasicStream.js"
import type { ReversibleStream, StartedStream } from "./ReversibleStream.js"
import type { FinishableStream } from "main.js"

export interface UnderStream<StreamType extends BasicStream = BasicStream, Type = any>
	extends Inputted<StreamType>,
		BasicStream<Type> {}

export function underStreamPrev(this: UnderStream<ReversibleStream>) {
	return this.input.prev()
}

export function underStreamNext(this: UnderStream) {
	return this.input.next()
}

export function underStreamCurr(this: UnderStream) {
	return this.input.curr()
}

export function underStreamIsEnd(this: UnderStream) {
	return this.input.isEnd
}

export function underStreamIsStart(this: StartedStream) {
	return this.input.isStart
}

export function underStreamRewind(this: UnderStream<RewindableStream>) {
	return this.input.rewind()
}

export function underStreamFinish(this: UnderStream<FinishableStream>) {
	return this.input.finish()
}

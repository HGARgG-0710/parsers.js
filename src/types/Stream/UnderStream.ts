import type { RewindableStream } from "./RewindableStream.js"
import type { BasicStream, Inputted } from "./BasicStream.js"
import type { ReversibleStream, StartedStream } from "./ReversibleStream.js"
import type { FinishableStream } from "./FinishableStream.js"

export interface UnderStream<StreamType extends BasicStream = BasicStream, Type = any>
	extends Inputted<StreamType>,
		BasicStream<Type> {}

export function underStreamPrev<Type = any>(this: UnderStream<ReversibleStream, Type>) {
	return this.input.prev()
}

export function underStreamNext<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.next()
}

export function underStreamCurr<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.curr
}

export function underStreamIsEnd<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.isEnd
}

export function underStreamIsStart<Type = any>(this: StartedStream<Type>) {
	return this.input.isStart
}

export function underStreamRewind<Type = any>(this: UnderStream<RewindableStream, Type>) {
	return this.input.rewind()
}

export function underStreamFinish<Type = any>(this: UnderStream<FinishableStream, Type>) {
	return this.input.finish()
}

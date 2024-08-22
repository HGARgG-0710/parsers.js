import type { BasicStream, Inputted } from "./BasicStream.js"
import type { ReversibleStream } from "./ReversibleStream.js"

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

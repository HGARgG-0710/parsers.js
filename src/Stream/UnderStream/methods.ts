import type {
	BaseUnderStream,
	ReverseBaseUnderStream,
	UnderStream
} from "./interfaces.js"

import type {
	BaseStream,
	BasicStream,
	ReverseBaseStream
} from "../BasicStream/interfaces.js"

import type { FinishableStream } from "../FinishableStream/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { RewindableStream } from "../RewindableStream/interfaces.js"

export function underStreamPrev<Type = any>(this: UnderStream<ReversibleStream, Type>) {
	return this.input.prev()
}

export function underStreamNext<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.next()
}

export function underStreamCurr<Type = any>(this: UnderStream<BasicStream, Type>) {
	return this.input.curr
}

export function underStreamIsEnd<Type = any>(this: BaseUnderStream<BaseStream, Type>) {
	return this.input.isCurrEnd()
}

export function underStreamIsStart<Type = any>(
	this: ReverseBaseUnderStream<ReverseBaseStream, Type>
) {
	return this.input.isCurrStart()
}

export function underStreamRewind<Type = any>(this: UnderStream<RewindableStream, Type>) {
	return this.input.rewind()
}

export function underStreamFinish<Type = any>(this: UnderStream<FinishableStream, Type>) {
	return this.input.finish()
}

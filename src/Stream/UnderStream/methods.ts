import type {
	BaseStream,
	BasicStream,
	FinishableStream,
	ReverseBaseStream,
	ReversibleStream,
	RewindableStream
} from "_src/types.js"

import type {
	BaseUnderStream,
	ReverseBaseUnderStream,
	UnderStream
} from "./interfaces.js"

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

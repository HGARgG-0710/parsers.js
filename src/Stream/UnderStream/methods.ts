import type { BaseUnderStream, IsCurrableUnderStream, UnderStream } from "./interfaces.js"

import type { BasicStream } from "../BasicStream/interfaces.js"

import type { FinishableStream } from "../FinishableStream/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { RewindableStream } from "../RewindableStream/interfaces.js"
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

export function underStreamRewind<Type = any>(this: UnderStream<RewindableStream, Type>) {
	return this.input.rewind()
}

export function underStreamFinish<Type = any>(this: UnderStream<FinishableStream, Type>) {
	return this.input.finish()
}

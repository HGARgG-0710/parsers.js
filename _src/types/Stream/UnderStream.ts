import type { RewindableStream } from "./RewindableStream.js"
import type { BaseStream, BasicStream, ReverseBaseStream } from "./BasicStream.js"
import type { Inputted } from "src/interfaces/Inputted.js"
import type { ReversibleStream } from "./ReversibleStream.js"
import type { FinishableStream } from "./FinishableStream.js"

export interface UnderStream<StreamType extends BasicStream = BasicStream, Type = any>
	extends Inputted<StreamType>,
		BasicStream<Type> {}

export interface BaseUnderStream<StreamType extends BaseStream = BaseStream, Type = any>
	extends UnderStream<StreamType, Type>,
		BaseStream<Type> {}

export interface ReverseBaseUnderStream<
	StreamType extends ReverseBaseStream = ReverseBaseStream,
	Type = any
> extends UnderStream<StreamType, Type>,
		ReverseBaseStream<Type> {}

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

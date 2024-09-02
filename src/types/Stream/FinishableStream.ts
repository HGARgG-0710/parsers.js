import type { InputStream } from "./InputStream.js"
import type { BasicStream } from "./BasicStream.js"
import { isFinishable, type Finishable } from "src/interfaces/Finishable.js"

export interface FinishableStream<Type = any>
	extends BasicStream<Type>,
		Finishable<Type> {}

export function inputStreamFinish<Type = any>(this: InputStream<Type>) {
	this.isEnd = true
	return this.input[(this.pos = this.input.length - 1)]
}

export function finish(stream: BasicStream) {
	while (!stream.isEnd) stream.next()
}

// * Note: this is done (at all) because of HOW MUCH faster is finishing a Stream for certain implementations via '.finish' is (freq. example: InputStream), or can be made to be (ReversedStream);
export function unifinish(stream: BasicStream) {
	if (isFinishable(stream)) stream.finish()
	else finish(stream)
}

import type { InputStream } from "main.js"
import type { BasicStream } from "./BasicStream.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export interface FinishableStream<Type = any> extends BasicStream<Type> {
	finish(): Type
}

export function inputStreamFinish<Type = any>(this: InputStream<Type>) {
	this.isEnd = true
	return this.input[(this.pos = this.input.length - 1)]
}

export function finish(stream: BasicStream) {
	while (!stream.isEnd) stream.next()
}

const finishCheck = structCheck("finish")
export function isFinishableStream(stream: BasicStream): stream is FinishableStream {
	return finishCheck(stream) && isFunction(stream.finish)
}

// * Note: this is done (at all) because of HOW MUCH faster is finishing a Stream for certain implementations via '.finish' is (freq. example: InputStream), or can be made to be (ReversedStream);
export function unifinish(stream: BasicStream) {
	if (isFinishableStream(stream)) stream.finish()
	else finish(stream)
}

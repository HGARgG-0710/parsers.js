import type { BasicReversibleStream, ReversedStream } from "./interfaces.js"
import { fastFinish } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

export function reversedStreamInitialize<Type = any>(
	this: ReversedStream<Type>,
	value?: BasicReversibleStream<Type>
): ReversedStream<Type> {
	if (value) {
		fastFinish(value)
		superInit(this, value)
	}
	return this
}

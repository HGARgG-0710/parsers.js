import type { ReversedStream } from "./interfaces.js"
import { fastFinish, superInit } from "../StreamClass/utils.js"

export function reversedStreamInitialize<Type = any>(
	this: ReversedStream<Type>,
	value?: ReversedStream<Type>
): ReversedStream<Type> {
	if (value) {
		fastFinish(value)
		superInit(this, value)
	}
	return this
}

import type { ReversedStream } from "./interfaces.js"
import { fastFinish, superInit } from "../StreamClass/utils.js"

export function reversedStreamInitialize<Type = any>(
	this: ReversedStream<Type>,
	value: ReversedStream<Type>
): ReversedStream<Type> {
	fastFinish(value)
	superInit(this, value)
	return this
}

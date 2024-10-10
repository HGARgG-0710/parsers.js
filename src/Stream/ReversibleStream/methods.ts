import type { ReversedStream } from "./interfaces.js"
import { fastFinish, superInit } from "../StreamClass/utils.js"
import { Inputted } from "../StreamClass/classes.js"

export function reversedStreamInitialize<Type = any>(
	this: ReversedStream<Type>,
	input: ReversedStream<Type>
): ReversedStream<Type> {
	fastFinish(input)
	Inputted(this, input)
	superInit(this)
	return this
}

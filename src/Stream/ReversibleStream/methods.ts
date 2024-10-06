import type { ReversedStream } from "./interfaces.js"
import { fastFinish } from "../StreamClass/Finishable/utils.js"
import { Inputted } from "../UnderStream/classes.js"
import { superInit } from "../StreamClass/Superable/utils.js"

export function reversedStreamInitialize<Type = any>(
	this: ReversedStream<Type>,
	input: ReversedStream<Type>
): ReversedStream<Type> {
	fastFinish(input)
	Inputted(this, input)
	superInit(this)
	return this
}

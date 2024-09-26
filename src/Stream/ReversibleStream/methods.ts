import { fastFinish } from "../FinishableStream/utils.js"
import { Inputted } from "../UnderStream/classes.js"
import type { ReversedStream } from "./interfaces.js"

export function reversedStreamInitialize<Type>(
	this: ReversedStream<Type>,
	input: ReversedStream<Type>
): ReversedStream<Type> {
	fastFinish(input)
	Inputted(this, input)
	return this
}

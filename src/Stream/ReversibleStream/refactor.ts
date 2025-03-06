import type { BasicReversibleStream, IReversedStream } from "./interfaces.js"

import { fastFinish } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

export function reversedStreamInitialize<Type = any>(
	this: IReversedStream<Type>,
	value?: BasicReversibleStream<Type>
): IReversedStream<Type> {
	if (value) {
		fastFinish(value)
		superInit(this, value)
	}
	return this
}

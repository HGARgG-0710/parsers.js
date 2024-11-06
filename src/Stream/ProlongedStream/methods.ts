import type { BasicStream } from "../interfaces.js"
import type { EffectiveProlongedStream, ProlongedStream } from "./interfaces.js"

import { isEnd } from "../../utils.js"
import { superInit } from "../StreamClass/utils.js"

export function effectiveProlongedStreamIsEnd<Type = any>(
	this: EffectiveProlongedStream<Type>
) {
	return (
		this.value[this.streamIndex].isCurrEnd() &&
		this.value.length - 1 > this.streamIndex
	)
}

export function prolongedStreamCurr<Type = any>(this: ProlongedStream<Type>) {
	return this.value[this.streamIndex].curr
}

export function effectiveProlongedStreamNext<Type = any>(
	this: EffectiveProlongedStream<Type>
) {
	const currStream = this.value[this.streamIndex]
	if (currStream.isCurrEnd()) ++this.streamIndex
	else currStream.next()
	return currStream.curr
}

export function prolongedStreamDefaultIsEnd<Type = any>(this: ProlongedStream<Type>) {
	return this.value.every(isEnd)
}

export function prolongedStreamInitialize<Type = any>(
	this: ProlongedStream<Type>,
	streams?: BasicStream<Type>[]
) {
	if (streams) {
		this.streamIndex = 0
		superInit(this, streams)
	}
	return this
}

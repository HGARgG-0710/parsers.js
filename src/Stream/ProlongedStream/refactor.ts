import type { BasicStream } from "../interfaces.js"
import type { ProlongedStream } from "./interfaces.js"

import { lastIndex } from "../../utils.js"
import { isEnd } from "../utils.js"
import { superInit } from "../StreamClass/refactor.js"

export function prolongedStreamIsEnd<Type = any>(this: ProlongedStream<Type>) {
	return (
		this.value![this.streamIndex].isCurrEnd() &&
		lastIndex(this.value!) > this.streamIndex
	)
}

export function prolongedStreamCurr<Type = any>(this: ProlongedStream<Type>) {
	return this.value![this.streamIndex].curr
}

export function prolongedStreamNext<Type = any>(this: ProlongedStream<Type>) {
	const currStream = this.value![this.streamIndex]
	if (currStream.isCurrEnd()) ++this.streamIndex
	else currStream.next()
	return currStream.curr
}

export function prolongedStreamDefaultIsEnd<Type = any>(this: ProlongedStream<Type>) {
	return this.value!.every(isEnd)
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

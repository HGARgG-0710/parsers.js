import type { BasicStream } from "../interfaces.js"
import type { EffectiveProlongedStream, ProlongedStream } from "./interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { superInit } from "../StreamClass/Superable/utils.js"

export function effectiveProlongedStreamIsEnd<Type = any>(
	this: EffectiveProlongedStream<Type>
) {
	return (
		this.input[this.streamIndex].isCurrEnd() &&
		this.input.length - 1 > this.streamIndex
	)
}

export function prolongedStreamCurr<Type = any>(this: ProlongedStream<Type>) {
	return this.input[this.streamIndex].curr
}

export function effectiveProlongedStreamNext<Type = any>(
	this: EffectiveProlongedStream<Type>
) {
	const currStream = this.input[this.streamIndex]
	if (currStream.isCurrEnd()) ++this.streamIndex
	else currStream.next()
	++this.pos
	return currStream.curr
}

export function prolongedStreamDefaultIsEnd<Type = any>(this: ProlongedStream<Type>) {
	return this.input.every((x) => x.isEnd)
}

export function prolongedStreamInitialize<Type = any>(
	this: ProlongedStream<Type>,
	streams?: BasicStream<Type>[]
) {
	this.pos = 0
	if (streams) {
		Inputted(this, streams)
		this.streamIndex = 0
		superInit(this)
	}
	return this
}

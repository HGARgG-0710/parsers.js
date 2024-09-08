import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { InputStream } from "./interfaces.js"
import { InputStream as InputStreamConstructor } from "./classes.js"
import { navigate } from "../NavigableStream/utils.js"

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1
}

export function inputStreamNext<Type = any>(this: InputStream<Type>) {
	return this.input[++this.pos]
}

export function inputStreamRewind<Type = any>(this: InputStream<Type>) {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function inputStreamNavigate<Type = any>(
	this: InputStream<Type>,
	index: Position
) {
	index = positionConvert(index, this)
	if (isNumber(index)) {
		if (index < 0) index += this.input.length
		return this.input[(this.pos = index)]
	}
	navigate(this, index)
	return this.input[positionConvert(this.pos) as number]
}

export function* inputStreamIterator<Type = any>(this: InputStream<Type>) {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
}

export function inputStreamFinish<Type = any>(this: InputStream<Type>) {
	this.isEnd = true
	return this.input[(this.pos = this.input.length - 1)]
}

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.input[this.pos]
}

export function inputStreamCopy<Type = any>(this: InputStream<Type>) {
	const inputStream = InputStreamConstructor<Type>(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function inputStreamIsStartGetter<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function inputStreamPrev<Type = any>(this: InputStream<Type>) {
	return this.input[--this.pos]
}

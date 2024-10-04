import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { EffectiveInputStream, InputStream } from "./interfaces.js"
import { InputStream as InputStreamConstructor } from "./classes.js"
import type { Indexed } from "../interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { uniNavigate } from "../StreamClass/Navigable/utils.js"

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1
}

export function inputStreamNext<Type = any>(this: InputStream<Type>) {
	return this.input[++this.pos]
}

export function effectiveInputStreamRewind<Type = any>(this: EffectiveInputStream<Type>) {
	this.isStart = true
	return this.input[(this.pos = 0)]
}

export function effectiveInputStreamNavigate<Type = any>(
	this: EffectiveInputStream<Type>,
	index: Position
) {
	index = positionConvert(index, this)
	if (isNumber(index)) return this.input[(this.pos = Math.max(this.pos + index, 0))]
	uniNavigate(this, index)
	return this.input[this.pos]
}

// * note: this is just 'streamIterator' inlined;
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

export function effectiveInputStreamCopy<Type = any>(this: EffectiveInputStream<Type>) {
	const inputStream = new InputStreamConstructor<Type>(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function inputStreamIsStart<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function inputStreamPrev<Type = any>(this: InputStream<Type>) {
	return this.input[--this.pos]
}

export function inputStreamDefaultIsEnd<Type = any>(this: InputStream<Type>) {
	return !this.input.length
}

export function inputStreamInitialize<Type = any>(
	this: InputStream<Type>,
	input?: Indexed<Type>
) {
	if (input) {
		Inputted(this, input)
		this.super.init.call(this)
	}
	this.pos = 0
	return this
}

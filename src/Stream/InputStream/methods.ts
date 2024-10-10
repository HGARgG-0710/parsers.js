import type { Position } from "../../Position/interfaces.js"
import type { EffectiveInputStream, InputStream } from "./interfaces.js"
import type { Indexed } from "../interfaces.js"

import { InputStream as InputStreamClass } from "./classes.js"
import { positionConvert } from "../../Position/utils.js"
import { Inputted } from "../StreamClass/classes.js"
import { uniNavigate, superInit } from "../StreamClass/utils.js"

import { StreamClass } from "../../constants.js"

import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1
}

export function inputStreamNext<Type = any>(this: InputStream<Type>) {
	return this.input[++this.pos]
}

export function effectiveInputStreamRewind<Type = any>(this: EffectiveInputStream<Type>) {
	this.isStart = StreamClass.PostCurrInit
	return this.input[(this.pos = 0)]
}

export function effectiveInputStreamNavigate<Type = any>(
	this: InputStreamClass<Type>,
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

export function effectiveInputStreamCopy<Type = any>(this: InputStreamClass<Type>) {
	const inputStream = new InputStreamClass<Type>(this.input)
	inputStream.pos = this.pos
	return inputStream
}

export function inputStreamIsStart<Type = any>(this: InputStreamClass<Type>) {
	return !this.pos
}

export function inputStreamPrev<Type = any>(this: InputStreamClass<Type>) {
	return this.input[--this.pos]
}

export function inputStreamDefaultIsEnd<Type = any>(this: InputStream<Type>) {
	return !this.input.length
}

export function effectiveInputStreamInitialize<Type = any>(
	this: InputStreamClass<Type>,
	input?: Indexed<Type>
) {
	this.pos = 0
	if (input) {
		Inputted(this, input)
		superInit(this)
	}
	return this
}

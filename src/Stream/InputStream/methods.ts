import type { InputStream } from "./interfaces.js"

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.input.length - 1
}

export function inputStreamNext<Type = any>(this: InputStream<Type>) {
	return this.input[++this.pos]
}

export function inputStreamFinish<Type = any>(this: InputStream<Type>) {
	this.isEnd = true
	return this.input[(this.pos = this.input.length - 1)]
}

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.buffer[this.pos]
}

export function inputStreamIsStart<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function inputStreamPrev<Type = any>(this: InputStream<Type>) {}

export function inputStreamDefaultIsEnd<Type = any>(this: InputStream<Type>) {
	return !this.buffer.length
}

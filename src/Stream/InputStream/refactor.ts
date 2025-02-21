import type { InputStream } from "./interfaces.js"

export function inputStreamIsEnd<Type = any>(this: InputStream<Type>) {
	return this.pos >= this.buffer.size - 1
}

export const inputStreamNext = inputStreamCurr
export const inputStreamPrev = inputStreamCurr

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.buffer.read(this.pos)
}

export function inputStreamIsStart<Type = any>(this: InputStream<Type>) {
	return !this.pos
}

export function inputStreamDefaultIsEnd<Type = any>(this: InputStream<Type>) {
	return !this.buffer.size
}

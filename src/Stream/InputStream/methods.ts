import type { InputStream } from "./interfaces.js"

// * Explanation: the '.curr' definition is provided in case that an 'UnfreezableBuffer' is used,
// * 	AND the user (for whatever reasons), decides to control the '.isFrozen'
// * 	to cause values repetitions inside the ".buffer";
// * '.isEnd', '.isCurr' are defined for the same reasons...;

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

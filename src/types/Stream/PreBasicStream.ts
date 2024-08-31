import type { StreamIterable } from "./StreamIterable.js"
import type { InputStream } from "./InputStream.js"

export interface PreBasicStream<Type = any> extends StreamIterable<Type> {
	curr: Type
}

export function inputStreamCurr<Type = any>(this: InputStream<Type>) {
	return this.input[this.pos]
}

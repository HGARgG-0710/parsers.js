import type { SummatIterable } from "@hgargg-0710/summat.ts"

import type { InputStream } from "./InputStream.js"
import type { BasicStream } from "./BasicStream.js"
export type IterableStream<Type = any> = BasicStream<Type> & SummatIterable<Type>

export function* inputStreamIterator<Type = any>(this: InputStream<Type>) {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
}

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

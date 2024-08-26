import type { SummatIterable } from "../Summat.js"
import type { BasicStream } from "./BasicStream.js"
export type IterableStream<Type = any> = BasicStream<Type> & SummatIterable<Type>

export function* inputStreamIterator() {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
}

export function* streamIterator() {
	while (!this.isEnd) yield this.next()
}

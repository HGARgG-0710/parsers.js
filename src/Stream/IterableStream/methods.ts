import type { BasicStream } from "../BasicStream/interfaces.js"
import type { InputStream } from "../InputStream/interfaces.js"

export function* inputStreamIterator<Type = any>(this: InputStream<Type>) {
	while (this.pos < this.input.length) {
		yield this.input[this.pos]
		++this.pos
	}
}

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

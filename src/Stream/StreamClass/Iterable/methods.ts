import type { BasicStream } from "../../BasicStream/interfaces.js"

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

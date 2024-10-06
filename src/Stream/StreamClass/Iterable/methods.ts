import type { BasicStream } from "src/Stream/interfaces.js"

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

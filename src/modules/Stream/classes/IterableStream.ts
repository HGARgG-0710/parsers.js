import { annotation } from "src/classes/Stream.js"

export abstract class IterableStream<
	Type = any,
	Args extends any[] = any[]
> extends annotation<Type, Args> {
	*[Symbol.iterator]() {
		while (!this.isEnd) {
			yield this.curr
			this.next()
		}
	}
}

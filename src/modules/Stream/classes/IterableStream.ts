import { annotation } from "src/classes/Stream.js"

export abstract class IterableStream<
	T = any,
	Args extends any[] = any[]
> extends annotation<T, Args> {
	*[Symbol.iterator]() {
		while (!this.isEnd) {
			yield this.curr
			this.next()
		}
	}
}

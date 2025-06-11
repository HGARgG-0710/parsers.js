import { annotation } from "src/classes/Stream.js"

/**
 * This is an abstract class implementing `IStrea<T, Args>`. 
 * 
 * It contains a basic implementation of `[Symbol.iterator]`, 
 * which walks through the entirety of the current stream, 
 * returning each item one by one. 
*/
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

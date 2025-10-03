import type { IStream } from "../../../interfaces.js"

/**
 * This is an abstract class implementing `IStrea<T, Args>`.
 *
 * It contains a basic implementation of `[Symbol.iterator]`,
 * which walks through the entirety of the current stream,
 * returning each item one by one.
 */
export abstract class IterableStream<T = any>
	implements IStream<T>, Iterable<T>
{
	abstract readonly isEnd: boolean
	abstract readonly curr: T
	abstract next(): void
	abstract isCurrEnd(): boolean

	*[Symbol.iterator]() {
		while (!this.isEnd) {
			yield this.curr
			this.next()
		}
	}
}

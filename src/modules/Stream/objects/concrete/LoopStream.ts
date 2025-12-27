import { ArrayStream } from "../templates.js"

/**
 * This is a class that extends `ArrayStream<T, T>`.
 * It represents an infinite `IStream<T>`, formed out of
 * items of type `T`. Useful for some cases when one doesn't
 * know in advance when an associated `IStream` is going
 * to finish.
 */
export class LoopStream<T = any> extends ArrayStream<T, (i: number) => T> {
	private streamIndex: number = 0

	private wrapped(index: number) {
		return index % this.items.length
	}

	private nextIndex() {
		return this.wrapped(++this.streamIndex)
	}

	protected baseNextIter(): T {
		const nextIndex = this.nextIndex()
		return this.items[nextIndex](this.streamIndex)
	}

	isCurrEnd(): boolean {
		return false // infinite stream - relies on another to finish
	}
}

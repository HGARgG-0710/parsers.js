import { ArrayStream } from "../templates.js"

/**
 * This is a class that extends `ArrayStream<T, T>`.
 * It represents an infinite `IStream<T>`, formed out of
 * items of type `T`. Useful for some cases when one doesn't
 * know in advance when an associated `IStream` is going
 * to finish.
 */
export class LoopStream<T = any> extends ArrayStream<T, () => T> {
	private streamIndex: number = 0

	private get itemCount() {
		return this.items.length
	}

	private wrapped(index: number) {
		return (this.streamIndex = index % this.itemCount)
	}

	protected baseNextIter(): T {
		return this.items[this.wrapped(this.streamIndex + 1)]()
	}

	isCurrEnd(): boolean {
		return false // infinite stream - relies on another to finish
	}
}

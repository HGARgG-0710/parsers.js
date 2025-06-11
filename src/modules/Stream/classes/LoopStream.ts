import { ArrayStream, ArrayStreamAnnotation } from "./ArrayStream.js"

class LoopStreamAnnotation<T = any> extends ArrayStreamAnnotation<T, T> {
	protected baseNextIter(): T {
		return null as T
	}

	isCurrEnd(): boolean {
		return false
	}
}

function BuildLoopStream<T = any>() {
	return class LoopStream extends ArrayStream.generic!<T, T>() {
		private index: number = 0

		private get itemCount() {
			return this.items.length
		}

		private wrapped(index: number) {
			return (this.index = index % this.itemCount)
		}

		protected baseNextIter(): T {
			return this.items[this.wrapped(this.index + 1)]
		}

		isCurrEnd(): boolean {
			return false
		}
	} as unknown as typeof LoopStreamAnnotation<T>
}

let loopStream: typeof LoopStreamAnnotation | null = null

function PreLoopStream<T = any>(): typeof LoopStreamAnnotation<T> {
	return loopStream
		? loopStream
		: (loopStream = BuildLoopStream<T>() as typeof LoopStreamAnnotation)
}

/**
 * This is a class that extends `ArrayStream<T, T>`. 
 * It represents an infinite `IStream<T>`, formed out of 
 * items of type `T`. Useful for some cases when one doesn't 
 * know in advance when an associated `IStream` is going 
 * to finish. 
 */
export const LoopStream: ReturnType<typeof PreLoopStream> & {
	generic?: typeof PreLoopStream
} = PreLoopStream()

LoopStream.generic = PreLoopStream

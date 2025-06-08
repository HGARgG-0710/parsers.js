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

		private wrapped(index: number) {
			return (this.index = index % this.items.length)
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

export const LoopStream: ReturnType<typeof PreLoopStream> & {
	generic?: typeof PreLoopStream
} = PreLoopStream()

LoopStream.generic = PreLoopStream

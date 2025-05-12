import { RetainedArray } from "../../classes/RetainedArray.js"
import type {
	IOwnedStream,
	IPeekable,
	IPeekStream
} from "../../interfaces/Stream.js"
import { RotationBuffer } from "../../internal/RotationBuffer.js"
import { write } from "../../utils/Stream.js"
import { DyssyncForwardStream } from "./WrapperStream.js"

export function PeekStream<Type = any>(
	n: number
): new (resource?: IOwnedStream<Type>) => IPeekStream<Type> {
	return class extends DyssyncForwardStream<Type> implements IPeekable<Type> {
		private readonly peekBuffer = new RotationBuffer<Type>(n)
		private readonly tempItems = new RetainedArray<Type>()

		private peekNonEmpty() {
			return this.peekBuffer.size > 0
		}

		private baseNextIter() {
			super.next()
			this.syncCurr()
		}

		private basePrevIter() {
			super.prev()
			this.syncCurr()
		}

		private fetchNextPeek() {
			const nextPeek = this.peekBuffer.read(0)
			this.peekBuffer.forward()
			this.curr = nextPeek
		}

		private trivialPeek() {
			return this.curr
		}

		private priorPeek(n: number) {
			return this.peekBuffer.read(n - 1)
		}

		private newPeek(n: number) {
			this.readTemp(n - this.peekBuffer.size)
			this.peekBuffer.push(...this.tempItems.get())
			return this.peekBuffer.last()
		}

		private readTemp(n: number) {
			write(this.resource!, this.tempItems.init(n))
		}

		private fetchPrevPeek() {
			this.peekBuffer.backward()
			if (this.peekNonEmpty()) this.basePrevIter()
			else this.replaceCurrWithNextPeek()
		}

		private replaceCurrWithNextPeek() {
			this.curr = this.peekBuffer.first()
			this.peekBuffer.forward()
		}

		peek(n: number) {
			switch (true) {
				case n === 0:
					return this.trivialPeek()

				case n <= this.peekBuffer.size:
					return this.priorPeek(n)

				default:
					return this.newPeek(n)
			}
		}

		isCurrEnd(): boolean {
			return this.resource!.isCurrEnd() && this.peekBuffer.size === 0
		}

		next() {
			const curr = this.curr
			if (this.isCurrEnd()) this.endStream()
			else if (this.peekNonEmpty()) this.fetchNextPeek()
			else this.baseNextIter()
			return curr
		}

		prev() {
			const curr = this.curr
			if (this.peekNonEmpty()) this.fetchPrevPeek()
			else this.basePrevIter()
			return curr
		}
	}
}

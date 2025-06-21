import { ownerInitializer } from "../../../classes/Initializer.js"
import { RetainedArray } from "../../../classes/RetainedArray.js"
import type { IInitializable, IInitializer } from "../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IPeekable,
	IPeekStream,
	IPrevable
} from "../../../interfaces/Stream.js"
import { RotationBuffer } from "../../../internal/RotationBuffer.js"
import { write } from "../../../utils/Stream.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"

interface IPeekResettable {
	resetPeeks(): void
}

type IPeekStreamConstructor<T = any> = new (
	resource?: IOwnedStream,
	n?: number
) => ILinkedStream<T> & IPeekable<T> & IPeekResettable & IPrevable

const peekStreamInitializer: IInitializer<[IOwnedStream]> = {
	init(
		target: IInitializable<[IOwnedStream]> & IPeekResettable,
		resource?: IOwnedStream
	) {
		ownerInitializer.init(target, resource)
		target.resetPeeks()
	}
}

function BuildPeekStream<T = any>() {
	return class
		extends DyssyncOwningStream.generic!<T, []>()
		implements IPeekable<T>
	{
		protected get initializer() {
			return peekStreamInitializer
		}

		private readonly tempItems = new RetainedArray<T>()
		private readonly peekBuffer: RotationBuffer<T>

		private get peekCount() {
			return this.peekBuffer.size
		}

		private unseenItems(total: number) {
			return total - this.peekCount
		}

		private isTrivial(n: number) {
			return n === 0
		}

		private hasSeen(n: number) {
			return n <= this.peekCount
		}

		private peekNonEmpty() {
			return this.peekCount > 0
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

		private newPeek(count: number) {
			this.toTemp(count)
			this.peekBuffer.push(...this.tempItems.get())
			return this.peekBuffer.last()
		}

		private toTemp(count: number) {
			write(this.resource!, this.tempItems.init(count))
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

		private remainsNoneSeen() {
			return this.peekCount === 0
		}

		peek(n: number) {
			switch (true) {
				case this.isTrivial(n):
					return this.trivialPeek()

				case this.hasSeen(n):
					return this.priorPeek(n)

				default:
					return this.newPeek(this.unseenItems(n))
			}
		}

		isCurrEnd(): boolean {
			return super.isCurrEnd() && this.remainsNoneSeen()
		}

		next() {
			this.isStart = false
			if (this.isCurrEnd()) this.endStream()
			else if (this.peekNonEmpty()) this.fetchNextPeek()
			else this.baseNextIter()
		}

		prev() {
			this.isEnd = false
			if (this.isCurrStart()) this.startStream()
			else if (this.peekNonEmpty()) this.fetchPrevPeek()
			else this.basePrevIter()
		}

		resetPeeks() {
			this.peekBuffer.clear()
		}

		constructor(resource?: IOwnedStream<T>, n: number = 1) {
			super(resource)
			this.peekBuffer = new RotationBuffer(n)
		}
	}
}

let peekStream: IPeekStreamConstructor | null = null

function PrePeekStream<T = any>(): IPeekStreamConstructor<T> {
	return peekStream ? peekStream : (peekStream = BuildPeekStream<T>())
}

/**
 * This is a function for creation of factories for the `IPeekStream<T>`
 * interface instances. It accepts an `IOwnedStream` as a `.resource`,
 * and allows the user to call `.peek(count: number): T`, which returns a
 * lookahead `count >= 0` items forward, with:
 *
 * 1. `.peek(0) == .curr`
 * 2. `.peek(n); n >= 1` comes directly after `.peek(n - 1)`
 *
 * Note that `.peek` doesn't actually change the current position,
 * so it's possible to call `.peek(n)` several times without `.next/.prev()`
 * in between, and expect the same results.
 *
 * Also note that the `IPeekStream<T>` in question is also
 * `IPrevable`, so if underlying `resource` supports `.prev()` calls,
 * then so should the returned `IPeekStream<T> & IPrevable` instance.
 *
 * The provided `n` is the initial (expected) lookahead. Making
 * a good guess for `n` can enable one to free oneself from needing
 * purposeless re-sizing of the lookahead-array.
 */
export function PeekStream<T = any>(n: number) {
	const peekStream = PrePeekStream()
	return function (resource?: IOwnedStream<T>): IPeekStream<T> & IPrevable {
		return new peekStream(resource, n)
	}
}

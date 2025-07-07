import { ownerInitializer } from "../../../classes/Initializer.js"
import { RetainedArray } from "../../../classes/RetainedArray.js"
import type { IInitializable, IInitializer } from "../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IPeekable,
	IPeekStream,
	IPrevable,
	IStream
} from "../../../interfaces/Stream.js"
import { RotationBuffer } from "../../../internal/RotationBuffer.js"
import { write } from "../../../utils/Stream.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"

interface IPeekResettable {
	resetPeeks(): void
}

interface IPeekProvidableFor<T = any> {
	trivialPeek(): T
	newPeek(n: number): T
}

type IPeekStreamConstructor<T = any> = new (
	resource?: IOwnedStream,
	n?: number
) => ILinkedStream<T> & IPeekable<T> & IPeekResettable & IPrevable

/**
 * This is a class for providing lookaheads
 * to the `PeekStream` by encapsulating the
 * underlying `RotationBuffer<T>` used for keeping
 * track of them.
 */
class PeekProvider<T = any> {
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

	private priorPeek(n: number) {
		return this.peekBuffer.read(n - 1)
	}

	isNone() {
		return this.peekCount === 0
	}

	provide(n: number, providableFor: IPeekProvidableFor<T>) {
		switch (true) {
			case this.isTrivial(n):
				return providableFor.trivialPeek()

			case this.hasSeen(n):
				return this.priorPeek(n)

			default:
				return providableFor.newPeek(this.unseenItems(n))
		}
	}

	hasAny() {
		return this.peekCount > 0
	}

	backward() {
		this.peekBuffer.backward()
	}

	fetchNext() {
		const nextPeek = this.peekBuffer.first()
		this.peekBuffer.forward()
		return nextPeek
	}

	last() {
		return this.peekBuffer.last()
	}

	push(items: readonly T[]) {
		this.peekBuffer.push(items)
	}

	reset() {
		this.peekBuffer.clear()
	}

	constructor(n: number = 1) {
		this.peekBuffer = new RotationBuffer(n)
	}
}

/**
 * A class for encapsulating read-writing
 * operation to a temporary `RetainedArray<T>`.
 */
class TempWriter<T = any> {
	private readonly tempItems = new RetainedArray<T>()

	toTemp(from: IStream<T>, count: number) {
		write(from, this.tempItems.init(count))
	}

	get() {
		return this.tempItems.get()
	}
}

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

		private readonly peekProvider: PeekProvider<T>
		private readonly tempWriter = new TempWriter<T>()

		private baseNextIter() {
			super.next()
			this.syncCurr()
		}

		private basePrevIter() {
			super.prev()
			this.syncCurr()
		}

		private fetchNextPeek() {
			this.curr = this.peekProvider.fetchNext()
		}

		private toTemp(count: number) {
			this.tempWriter.toTemp(this.resource!, count)
		}

		private fetchPrevPeek() {
			this.peekProvider.backward()
			if (this.peekProvider.hasAny()) this.basePrevIter()
			else this.fetchNextPeek()
		}

		trivialPeek() {
			return this.curr
		}

		newPeek(count: number) {
			this.toTemp(count)
			this.peekProvider.push(this.tempWriter.get())
			return this.peekProvider.last()
		}

		peek(n: number) {
			return this.peekProvider.provide(n, this)
		}

		isCurrEnd(): boolean {
			return super.isCurrEnd() && this.peekProvider.isNone()
		}

		next() {
			this.isStart = false
			if (this.isCurrEnd()) this.endStream()
			else if (this.peekProvider.hasAny()) this.fetchNextPeek()
			else this.baseNextIter()
		}

		prev() {
			this.isEnd = false
			if (this.isCurrStart()) this.startStream()
			else if (this.peekProvider.hasAny()) this.fetchPrevPeek()
			else this.basePrevIter()
		}

		resetPeeks() {
			this.peekProvider.reset()
		}

		constructor(resource?: IOwnedStream<T>, n: number = 1) {
			super(resource)
			this.peekProvider = new PeekProvider(n)
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

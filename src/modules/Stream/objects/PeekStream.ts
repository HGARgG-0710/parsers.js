import { Pools } from "../../../../main.js"
import type {
	IInitializable,
	IInitializer,
	IPoolKeeping
} from "../../../interfaces.js"
import type {
	ICommonStream,
	ILinkedStream,
	IOwnedStream,
	IPeekable,
	IStream
} from "../../../interfaces/Stream.js"
import { RotationBuffer } from "../../../internal/RotationBuffer.js"
import { mixin } from "../../../mixin.js"
import { ObjectPool } from "../../../objects.js"
import { ownerInitializer } from "../../../objects/Initializer.js"
import { RetainedArray } from "../../../objects/RetainedArray.js"
import { write } from "../../../utils/Stream.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"
import { PoolableStream } from "./PoolableStream.js"

const DefaultPeekSize = 4

interface IPeekResettable {
	resetPeeks(): void
}

interface IPeekProvidableFor<T = any> {
	trivialPeek(): T
	newPeek(n: number): T
	readonly peeksMaybeLeft: boolean
}

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

	private newPeek(n: number) {
		return this.providableFor.newPeek(this.unseenItems(n))
	}

	hasNone() {
		return this.peekCount === 0
	}

	provide(n: number) {
		switch (true) {
			case this.isTrivial(n):
				return this.providableFor.trivialPeek()

			case this.hasSeen(n):
				return this.priorPeek(n)

			default:
				return this.newPeek(n)
		}
	}

	hasAny() {
		return this.peekCount > 0
	}

	has(n: number) {
		if (this.hasSeen(n)) return true
		this.newPeek(n)
		return this.providableFor.peeksMaybeLeft
	}

	fetchNext() {
		const nextPeek = this.peekBuffer.first()
		this.peekBuffer.forward()
		return nextPeek
	}

	advance(n: number) {
		if (n > 1) this.peekBuffer.forward(n - 1)
		return this.fetchNext()
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

	constructor(
		private readonly providableFor: IPeekProvidableFor<T>,
		n: number = 1
	) {
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
		const writtenItems = write(from, this.tempItems.init(count))
		return writtenItems === count
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

const _PeekStream = new mixin(
	{
		name: "PeekStream",
		static: {
			pool: (classObj) =>
				Pools.Stream.add(
					new ObjectPool(
						classObj as new (
							resource?: IOwnedStream
						) => ILinkedStream & IPeekable
					)
				)
		},
		properties: {
			peeksMaybeLeft: false,

			baseNextIter() {
				this.super.DyssyncOwningStream.next.call(this)
				this.syncCurr()
			},

			fetchNextPeek() {
				this.curr = this.peekProvider.fetchNext()
			},

			toTemp(count: number) {
				return this.tempWriter.toTemp(this.resource!, count)
			},

			get pool() {
				return this.constructor.pool
			},

			get initializer() {
				return peekStreamInitializer
			},

			trivialPeek() {
				return this.curr
			},

			newPeek(count: number) {
				this.peeksMaybeLeft = this.toTemp(count)
				this.peekProvider.push(this.tempWriter.get())
				return this.peekProvider.last()
			},

			peek(n: number) {
				return this.peekProvider.provide(n)
			},

			isCurrEnd(): boolean {
				return (
					this.super.DyssyncOwningStream.isCurrEnd.call(this) &&
					this.peekProvider.hasNone()
				)
			},

			next() {
				if (this.isCurrEnd()) this.endStream()
				else if (this.peekProvider.hasAny()) this.fetchNextPeek()
				else this.baseNextIter()
			},

			hasPeek(n: number) {
				return this.peekProvider.has(n)
			},

			toPeek(n: number) {
				this.curr = this.peekProvider.advance(n)
			},

			resetPeeks() {
				this.peekProvider.reset()
			}
		},
		constructor(resource?: IOwnedStream) {
			this.super.DyssyncOwningStream.constructor.call(this, resource)
			this.peekProvider = new PeekProvider(this, DefaultPeekSize)
			this.tempWriter = new TempWriter()
		}
	},
	[DyssyncOwningStream, PoolableStream]
).toClass() as unknown as IPoolKeeping<ICommonStream & IPeekable>

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
 * so it's possible to call `.peek(n)` several times without `.next()`
 * in between, and expect the same result.
 */
export function PeekStream<T = any>(
	resource?: IOwnedStream<T>
): ICommonStream<T> & IPeekable<T> {
	return _PeekStream.pool.create(resource)
}

export namespace PeekStream {
	export const pool = _PeekStream.pool
}

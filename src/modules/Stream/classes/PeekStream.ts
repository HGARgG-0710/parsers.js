import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import { ownerInitializer } from "../../../classes/Initializer.js"
import { RetainedArray } from "../../../classes/RetainedArray.js"
import type {
	IInitializable,
	IInitializer,
	IPoolKeeping
} from "../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IPeekable,
	IPeekStream,
	IStream
} from "../../../interfaces/Stream.js"
import { RotationBuffer } from "../../../internal/RotationBuffer.js"
import { mixin } from "../../../mixin.js"
import { write } from "../../../utils/Stream.js"
import { DyssyncOwningStream } from "./DyssyncOwningStream.js"
import { PoolableStream } from "./PoolableStream.js"

interface IPeekResettable {
	resetPeeks(): void
}

interface IPeekProvidableFor<T = any> {
	trivialPeek(): T
	newPeek(n: number): T
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

	hasNone() {
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
	return new mixin<ILinkedStream<T> & IPeekable<T>>(
		{
			name: "PeekStream",
			static: {
				pool: (classObj) =>
					Pools.Stream.add(
						new ObjectPool(
							classObj as new (
								resource?: IOwnedStream<T>
							) => ILinkedStream<T> & IPeekable<T>
						)
					)
			},
			properties: {
				baseNextIter() {
					super.next()
					this.syncCurr()
				},

				fetchNextPeek() {
					this.curr = this.peekProvider.fetchNext()
				},

				toTemp(count: number) {
					this.tempWriter.toTemp(this.resource!, count)
				},

				get pool() {
					return this.class.pool
				},

				get initializer() {
					return peekStreamInitializer
				},

				trivialPeek() {
					return this.curr
				},

				newPeek(count: number) {
					this.toTemp(count)
					this.peekProvider.push(this.tempWriter.get())
					return this.peekProvider.last()
				},

				peek(n: number) {
					return this.peekProvider.provide(n, this)
				},

				isCurrEnd(): boolean {
					return super.isCurrEnd() && this.peekProvider.hasNone()
				},

				next() {
					if (this.isCurrEnd()) this.endStream()
					else if (this.peekProvider.hasAny()) this.fetchNextPeek()
					else this.baseNextIter()
				},

				resetPeeks() {
					this.peekProvider.reset()
				}
			},
			constructor(resource?: IOwnedStream<T>) {
				this.super.DyssyncOwningStream.constructor.call(this, resource)
				this.peekProvider = new PeekProvider(1)
				this.tempWriter = new TempWriter()
			}
		},
		[],
		[DyssyncOwningStream, PoolableStream]
	) as unknown as IPoolKeeping<IPeekStream<T>>
}

let peekStream: IPoolKeeping<IPeekStream> | null = null

function PrePeekStream<T = any>() {
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
 * so it's possible to call `.peek(n)` several times without `.next()`
 * in between, and expect the same result.
 */
export function PeekStream<T = any>(
	resource?: IOwnedStream<T>
): IPeekStream<T> {
	return PrePeekStream().pool.create(resource)
}

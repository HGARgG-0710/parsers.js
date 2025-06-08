import { ownerInitializer } from "../../../classes/Initializer.js"
import { RetainedArray } from "../../../classes/RetainedArray.js"
import type { IInitializable, IInitializer } from "../../../interfaces.js"
import type {
	ILinkedStream,
	IOwnedStream,
	IPeekable,
	IPeekStream
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
) => ILinkedStream<T> & IPeekable<T> & IPeekResettable

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

export function PeekStream<Type = any>(n: number) {
	const peekStream = PrePeekStream()
	return function (resource?: IOwnedStream<Type>): IPeekStream<Type> {
		return new peekStream(resource, n)
	}
}

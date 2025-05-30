import { ownerInitializer } from "../../../classes/Initializer.js"
import { RetainedArray } from "../../../classes/RetainedArray.js"
import type { IInitializer } from "../../../interfaces.js"
import type {
	IOwnedStream,
	IPeekable,
	IPeekStream
} from "../../../interfaces/Stream.js"
import { RotationBuffer } from "../../../internal/RotationBuffer.js"
import { write } from "../../../utils/Stream.js"
import { DyssyncStream } from "./WrapperStream.js"

const peekStreamInitializer: IInitializer<[IOwnedStream]> = {
	init(target: _PeekStream, resource?: IOwnedStream) {
		ownerInitializer.init(target, resource)
		target.resetPeeks()
	}
}

class _PeekStream<Type = any>
	extends DyssyncStream<Type>
	implements IPeekable<Type>
{
	protected get initializer() {
		return peekStreamInitializer
	}

	private readonly tempItems = new RetainedArray<Type>()
	private readonly peekBuffer: RotationBuffer<Type>

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

	constructor(resource?: IOwnedStream<Type>, n: number = 1) {
		super(resource)
		this.peekBuffer = new RotationBuffer(n)
	}
}

export function PeekStream<Type = any>(n: number) {
	return function (resource?: IOwnedStream<Type>): IPeekStream<Type> {
		return new _PeekStream(resource, n)
	}
}

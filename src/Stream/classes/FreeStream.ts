import type {
	IFreeable,
	IOwnedStream,
	IPoolGetter,
	IStarted
} from "../../interfaces.js"
import { ThreeQueue } from "../../internal/ThreeQueue.js"
import { WrapperStream } from "./WrapperStream.js"

export class FreeStream<
	Type extends IFreeable = any
> extends WrapperStream<Type> {
	private poolGetter: IPoolGetter
	private freeablesQueue = new ThreeQueue<Type>()

	resource?: IOwnedStream & IStarted

	private enqueueCurrForFreeing() {
		this.freeablesQueue.push(this.curr)
	}

	private freeFirstEnqueued() {
		this.freeablesQueue.shift()!.free(this.poolGetter)
	}

	private isQueueFull() {
		return this.freeablesQueue.isFull()
	}

	withPoolGetter(poolGetter: IPoolGetter) {
		this.poolGetter = poolGetter
		return this
	}

	next(): Type {
		this.enqueueCurrForFreeing()
		const curr = super.next()
		if (this.isQueueFull()) this.freeFirstEnqueued()
		return curr
	}
}

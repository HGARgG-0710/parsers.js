import { OwningStream } from "../../../classes/Stream.js"

export abstract class DelegateStream<
	Type = any,
	Args extends any[] = any[]
> extends OwningStream<Type, Args> {
	prev() {
		this.resource!.prev!()
	}

	next() {
		this.resource!.next()
	}

	isCurrStart() {
		return this.resource!.isCurrStart!()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd()
	}
}

export abstract class SyncStream<
	Type = any,
	Args extends any[] = any[]
> extends DelegateStream<Type, Args> {
	get curr() {
		return this.resource!.curr
	}

	get isEnd() {
		return this.resource!.isEnd
	}

	get isStart() {
		return this.resource!.isStart
	}
}

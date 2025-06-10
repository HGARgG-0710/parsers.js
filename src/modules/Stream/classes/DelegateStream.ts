import { OwningStream } from "./OwningStream.js"

export abstract class DelegateStream<
	T = any,
	Args extends any[] = []
> extends OwningStream<T, Args> {
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

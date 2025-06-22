import { OwningStream } from "./OwningStream.js"

/**
 * This is an abstract class extending `OwningStream<T, Args>`.
 * It delegates methods of `.prev()`, `.next()`, `.isCurrStart()`
 * and `.isCurrEnd()` to `this.resource: IOwnedStream`.
 */
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

import { OwningStream } from "./OwningStream.js"

/**
 * This is an abstract class extending `OwningStream<T, Args>`.
 * It delegates methods of `.next()` and `.isCurrEnd()` 
 * to `this.resource: IOwnedStream`.
 */
export abstract class DelegateStream<
	T = any,
	Args extends any[] = []
> extends OwningStream<T, Args> {
	next() {
		this.resource!.next()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd()
	}
}

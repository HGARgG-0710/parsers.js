import { IterableStream } from "../../../classes/Stream.js"
import type { IStream } from "../../../interfaces.js"
import { resourceInitializer } from "../../../classes/Initializer.js"

export abstract class DelegateStream<
	Type = any,
	Args extends any[] = []
> extends IterableStream<Type, [IStream, ...(Args | [])]> {
	resource?: IStream<Type>

	protected get initializer() {
		return resourceInitializer
	}

	init(resource?: IStream<Type>): this {
		return super.init(resource)
	}

	get curr() {
		return this.resource!.curr
	}

	get isEnd() {
		return this.resource!.isEnd
	}

	get isStart() {
		return this.resource!.isStart!
	}

	prev() {
		return this.resource!.prev!()
	}

	next() {
		return this.resource!.next()
	}

	isCurrStart() {
		return this.resource!.isCurrStart!()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd()
	}
}

import { InitStream } from "../../classes/Stream.js"
import type { IStream } from "../../interfaces.js"
import { resourceInitializer } from "./StreamInitializer.js"

export abstract class DelegateStream<
	Type = any
> extends InitStream<Type> {
	resource?: IStream<Type>

	protected get initializer() {
		return resourceInitializer
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

import { resourceInitializer } from "../../../classes/Initializer.js"
import { OwnableStream } from "../../../classes/Stream.js"
import type { IStream } from "../../../interfaces.js"

export abstract class DelegateStream<
	Type = any,
	Args extends any[] = []
> extends OwnableStream<Type, [IStream, ...(Args | [])]> {
	private _resource?: IStream<Type>

	protected set resource(newResource: IStream<Type> | undefined) {
		this._resource = newResource
	}

	get resource() {
		return this._resource
	}

	protected get initializer() {
		return resourceInitializer
	}

	init(resource?: IStream<Type>, ...args: Partial<Args>): this {
		return super.init(resource, ...args)
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

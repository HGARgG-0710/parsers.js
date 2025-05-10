import { IterableStream } from "./IterableStream.js"
import { isCopiable } from "../../utils.js"
import type {
	IOwnedStream,
	IOwnerSettable,
	IResourceSettable,
	IStream,
	IStreamIdentifiable
} from "../interfaces.js"
import { resourceInitializer } from "../StreamInitializer/classes.js"

export abstract class BasicStream<Type = any> extends IterableStream<Type> {
	protected abstract baseNextIter(): Type | void
	protected abstract update(newCurr?: Type | void): void

	protected postEnd?(): void
	protected basePrevIter?(): Type | void
	protected postStart?(): void
	protected initGetter?(...args: any[]): Type

	isCurrStart?(): boolean

	isStart: boolean = true
	isEnd: boolean = false
	curr: Type

	protected preInit(...args: any[]) {
		if (this.initGetter) this.curr = this.initGetter(...args)
	}

	protected endStream() {
		this.isEnd = true
		this.isStart = false
	}

	protected startStream() {
		this.isStart = true
		this.isEnd = false
	}

	next() {
		const curr = this.curr
		this.isStart = false
		if (this.isCurrEnd()) {
			this.endStream()
			this.postEnd?.()
		} else this.update(this.baseNextIter())
		return curr
	}

	prev() {
		const curr = this.curr
		this.isEnd = false
		if (this.isCurrStart!()) {
			this.startStream()
			this.postStart?.()
		} else this.update(this.basePrevIter!())
		return curr
	}

	init(...args: any[]) {
		this.startStream()
		this.preInit(...args)
		return this
	}

	constructor(resource?: unknown) {
		super()
		if (resource) this.init(resource)
	}
}

export abstract class ResourceStream<Type = any>
	extends BasicStream<Type>
	implements IOwnedStream<Type>, IResourceSettable, IOwnerSettable
{
	["constructor"]: new (resource?: unknown) => this

	owner?: IStream
	resource?: IStreamIdentifiable

	protected get initializer() {
		return resourceInitializer
	}

	copy() {
		return new this.constructor(
			isCopiable(this.resource) ? this.resource.copy() : this.resource
		)
	}

	setOwner(owner: IStream): void {
		this.owner = owner
	}

	setResource(resource: IStreamIdentifiable) {
		this.resource = resource
	}
}

export abstract class GetterStream<Type = any> extends ResourceStream<Type> {
	protected abstract currGetter(): Type

	protected initGetter(...args: any[]): Type {
		return this.currGetter()
	}

	protected update(newCurr?: Type) {
		this.curr = this.currGetter()
	}
}

export abstract class SetterStream<Type = any> extends ResourceStream<Type> {
	protected update(newCurr: Type) {
		this.curr = newCurr
	}
}

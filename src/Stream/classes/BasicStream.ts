import { isCopiable } from "../../utils.js"
import type {
	IOwnedStream,
	IOwningStream,
	IResourceSettable
} from "../../interfaces/Stream.js"
import { ownerInitializer, resourceInitializer } from "./StreamInitializer.js"
import { IterableStream } from "./IterableStream.js"

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

export abstract class OwnableStream<Type = any>
	extends BasicStream<Type>
	implements IOwnedStream
{
	owner?: IOwningStream

	setOwner(owner: IOwningStream): void {
		this.owner = owner
	}
}

export abstract class ResourceStream<Type = any>
	extends OwnableStream<Type>
	implements IOwnedStream<Type>
{
	["constructor"]: new (resource?: IOwnedStream) => this

	resource?: IOwnedStream

	protected get initializer() {
		return ownerInitializer
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	setResource(resource: IOwnedStream) {
		this.resource = resource
	}
}

export abstract class SourceStream<Type = any, SourceType = unknown>
	extends OwnableStream<Type>
	implements IResourceSettable
{
	["constructor"]: new (source?: unknown) => this

	source?: SourceType

	protected abstract currGetter(): Type

	protected get initializer() {
		return resourceInitializer
	}

	protected initGetter(): Type {
		return this.currGetter()
	}

	protected update() {
		this.curr = this.currGetter()
	}

	setResource(source?: SourceType) {
		this.source = source
	}

	copy(): this {
		return new this.constructor(
			isCopiable(this.source) ? this.source.copy() : this.source
		)
	}

	constructor(source?: SourceType) {
		super(source)
	}
}

export abstract class SetterStream<Type = any> extends ResourceStream<Type> {
	protected update(newCurr: Type) {
		this.curr = newCurr
	}
}

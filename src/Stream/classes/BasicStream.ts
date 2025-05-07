import { type } from "@hgargg-0710/one"
import type { IOwnedStream, IStream } from "../interfaces.js"
import { IterableStream } from "../../internal/IterableStream.js"

const { isStruct, isFunction } = type

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
	}

	protected startStream() {
		this.isStart = true
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
		super(resource)
		this.preInit()
	}
}

export abstract class ResourceStream<Type = any>
	extends BasicStream<Type>
	implements IOwnedStream<Type>
{
	owner?: IStream
	resource?: unknown

	claimBy(owner: IStream): void {
		this.owner = owner
	}

	init(resource: unknown) {
		this.resource = resource
		if (isStruct(resource) && isFunction((resource as any).claimBy))
			(resource as IOwnedStream<Type>).claimBy(this)
		return super.init()
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

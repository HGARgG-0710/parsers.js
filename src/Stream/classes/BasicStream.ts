import type { IOwnedStream, IStream } from "../interfaces.js"
import { type } from "@hgargg-0710/one"

const { isObject, isFunction } = type

export abstract class BasicStream<Type = any> implements IStream<Type> {
	protected abstract baseNextIter(): Type | void
	protected abstract update(newCurr?: Type | void): void

	protected end?(): void
	protected basePrevIter?(): Type | void
	protected start?(): void
	protected initGetter?(...args: any[]): Type

	abstract isCurrEnd(): boolean
	abstract copy(): this

	isCurrStart?(): boolean

	isStart: boolean = true
	isEnd: boolean = false
	curr: Type

	protected preInit(...args: any[]) {
		if (this.initGetter) this.curr = this.initGetter(...args)
	}

	next() {
		const curr = this.curr
		this.isStart = false
		if (this.isEnd || this.isCurrEnd()) {
			this.isEnd = true
			this.end?.()
		} else this.update(this.baseNextIter())
		return curr
	}

	prev() {
		const curr = this.curr
		this.isEnd = false
		if (this.isStart || this.isCurrStart!()) {
			this.isStart = true
			this.start?.()
		} else this.update(this.basePrevIter!())
		return curr
	}

	init(...args: any[]) {
		this.preInit(...args)
		return this
	}

	*[Symbol.iterator]() {
		while (!this.isEnd) yield this.next()
	}

	constructor() {
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
		if (isObject(resource) && isFunction((resource as any).claimBy))
			(resource as IOwnedStream<Type>).claimBy(this)
		return super.init()
	}

	constructor(resource?: unknown) {
		super()
		if (resource) this.init(resource)
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

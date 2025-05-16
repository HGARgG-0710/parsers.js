import type {
	IOwnedStream,
	IOwningStream,
	IResourceSettable
} from "../../interfaces/Stream.js"
import { isCopiable } from "../../utils.js"
import { InitStream } from "./IterableStream.js"
import { ownerInitializer, resourceInitializer } from "./StreamInitializer.js"

export abstract class BasicStream<Type = any> extends InitStream<Type> {
	protected abstract baseNextIter(): Type | void
	protected abstract update(newCurr?: Type | void): void

	protected postEnd?(): void
	protected basePrevIter?(): Type | void
	protected postStart?(): void
	protected initGetter?(...args: any[]): Type

	isCurrStart?(): boolean

	private _isStart: boolean = true
	private _isEnd: boolean = false
	private _curr: Type

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	protected set curr(newCurr: Type) {
		this._curr = newCurr
	}

	get isStart() {
		return this._isStart
	}

	get isEnd() {
		return this._isEnd
	}

	get curr() {
		return this._curr
	}

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
		super.init(...args)
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
	protected ["constructor"]: new (resource?: IOwnedStream) => this

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

	init(resource: IOwnedStream) {
		return super.init(resource)
	}
}

export abstract class SourceStream<Type = any, SourceType = unknown>
	extends OwnableStream<Type>
	implements IResourceSettable
{
	protected ["constructor"]: new (source?: SourceType) => this

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

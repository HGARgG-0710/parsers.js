import { isCopiable } from "src/is.js"
import {
	ownerInitializer,
	resourceInitializer
} from "../../../classes/Initializer.js"
import type { IResourceSettable } from "../../../interfaces.js"
import type { IOwnedStream } from "../../../interfaces/Stream.js"
import { OwnableStream } from "./IterableStream.js"

export abstract class BasicStream<
	Type = any,
	Args extends any[] = any[]
> extends OwnableStream<Type, Args> {
	protected abstract baseNextIter(): Type

	protected postEnd?(): void
	protected basePrevIter?(): Type
	protected postStart?(): void
	protected initGetter?(...args: Partial<Args>): Type

	isCurrStart?(): boolean

	private _isStart: boolean = true
	private _isEnd: boolean = false
	private _curr: Type

	protected update(newCurr: Type) {
		this.curr = newCurr
	}

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

	protected preInit(...args: Partial<Args>) {
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

	init(...args: Partial<Args>) {
		this.startStream()
		super.init(...args)
		this.preInit(...args)
		return this
	}
}

export abstract class ResourceStream<Type = any, MoreArgs extends any[] = []>
	extends BasicStream<Type, [IOwnedStream, ...(MoreArgs | [])]>
	implements IOwnedStream<Type>
{
	protected ["constructor"]: new (resource?: IOwnedStream) => this

	protected _resource?: IOwnedStream

	protected set resource(newResource: IOwnedStream | undefined) {
		this._resource = newResource
	}

	get resource() {
		return this._resource
	}

	protected get initializer() {
		return ownerInitializer
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	setResource(resource: IOwnedStream) {
		this.resource = resource
	}

	init(resource?: IOwnedStream) {
		return super.init(resource)
	}
}

export abstract class SourceStream<
		Type = any,
		SourceType = unknown,
		MoreArgs extends any[] = []
	>
	extends BasicStream<Type, [SourceType, ...(MoreArgs | [])]>
	implements IResourceSettable
{
	protected ["constructor"]: new (source?: SourceType) => this

	protected source?: SourceType

	protected abstract currGetter(): Type

	protected updateCurr() {
		this.update(this.currGetter())
	}

	protected get initializer() {
		return resourceInitializer
	}

	protected initGetter(): Type {
		return this.currGetter()
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

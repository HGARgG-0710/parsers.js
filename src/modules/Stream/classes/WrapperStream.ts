import { ownerInitializer } from "../../../classes/Initializer.js"
import type { IResourceSettable } from "../../../interfaces.js"
import type { IOwnedStream } from "../../../interfaces/Stream.js"
import { DelegateStream } from "./DelegateStream.js"

export abstract class ChainStream<Type = any, Args extends any[] = any[]>
	extends DelegateStream<Type, Args>
	implements IResourceSettable
{
	protected set resource(newResource: IOwnedStream | undefined) {
		super.resource = newResource
	}

	get resource() {
		return super.resource as IOwnedStream | undefined
	}

	protected get initializer() {
		return ownerInitializer
	}

	init(resource?: IOwnedStream, ...args: Partial<Args>) {
		return super.init(resource, ...args)
	}

	setResource(newResource: IOwnedStream) {
		this.resource = newResource
	}
}

export abstract class WrapperStream<Type = any, Args extends any[] = any[]>
	extends ChainStream<Type, Args>
	implements IOwnedStream<Type>
{
	protected ["constructor"]: new (resource?: IOwnedStream<Type>) => this

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	constructor(resource?: IOwnedStream<Type>) {
		super(resource)
	}
}

export abstract class DyssyncForwardStream<
	Type = any,
	Args extends any[] = any[]
> extends WrapperStream<Type, Args> {
	protected _isEnd: boolean = false
	protected _curr: Type

	protected syncCurr() {
		this.curr = this.resource!.curr
	}

	protected set isEnd(newIsEnd: boolean) {
		this._isEnd = newIsEnd
	}

	protected set curr(newCurr: Type) {
		this._curr = newCurr
	}

	get isEnd() {
		return this._isEnd
	}

	get curr() {
		return this._curr
	}

	protected endStream() {
		this.isEnd = true
	}
}

export abstract class DyssyncStream<
	Type = any,
	Args extends any[] = any[]
> extends DyssyncForwardStream<Type, Args> {
	protected _isStart: boolean = true

	protected set isStart(newIsStart: boolean) {
		this._isStart = newIsStart
	}

	get isStart() {
		return this._isStart
	}

	protected startStream() {
		this.isStart = true
		this.isEnd = false
	}

	protected endStream(): void {
		super.endStream()
		this.isStart = false
	}
}

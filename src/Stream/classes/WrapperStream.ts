import type {
	IOwnedStream,
	IOwningStream,
	IResourceSettable
} from "../../interfaces/Stream.js"
import { DelegateStream } from "./DelegateStream.js"
import { ownerInitializer } from "./StreamInitializer.js"

export abstract class ChainStream<Type> extends DelegateStream<Type> {
	resource?: IOwnedStream
	owner?: IOwningStream

	protected get initializer() {
		return ownerInitializer
	}

	setResource(newResource: IOwnedStream) {
		this.resource = newResource
	}

	setOwner(newOwner: IOwningStream): void {
		this.owner = newOwner
	}
}

export abstract class WrapperStream<Type = any>
	extends ChainStream<Type>
	implements IOwnedStream<Type>, IResourceSettable
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
	Type = any
> extends WrapperStream<Type> {
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
	Type = any
> extends DyssyncForwardStream<Type> {
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

import type { IOwnedStream } from "../interfaces.js"
import { OwnedStream } from "./OwnedStream.js"

export abstract class WrapperStream<Type = any> extends OwnedStream<Type> {
	declare resource?: IOwnedStream<Type>

	init(resource: IOwnedStream<Type>) {
		this.resource = resource
		resource.claimBy(this)
		return this
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
	}
}

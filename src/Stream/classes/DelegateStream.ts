import type { IStream } from "../../interfaces.js"
import { IterableStream } from "../../internal/IterableStream.js"

export abstract class DelegateStream<Type = any> extends IterableStream<Type> {
	["constructor"]: new (resource?: IStream<Type>) => this

	protected set curr(newCurr: Type) {
		;(this.resource!.curr as any) = newCurr
	}

	get curr() {
		return this.resource!.curr
	}

	protected set isEnd(newEnd: boolean) {
		;(this.resource!.isEnd as any) = newEnd
	}

	get isEnd() {
		return this.resource!.isEnd
	}

	protected set isStart(newStart: boolean) {
		this.resource!.isStart = newStart
	}

	get isStart() {
		return this.resource!.isStart!
	}

	prev() {
		return this.resource!.prev!()
	}

	next() {
		return this.resource!.next()
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	isCurrStart() {
		return this.resource!.isCurrStart!()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd()
	}

	init(resource: IStream<Type>) {
		this.resource = resource
		return this
	}

	constructor(public resource?: IStream<Type>) {
		super(resource)
	}
}

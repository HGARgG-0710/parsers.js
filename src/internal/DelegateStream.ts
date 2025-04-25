import type { IStream } from "../interfaces.js"

export class DelegateStream<Type = any>
	implements IStream<Type, [IStream<Type>]>
{
	["constructor"]: new (resource?: IStream<Type>) => typeof this

	set curr(newCurr: Type) {
		this.resource!.curr = newCurr
	}

	get curr() {
		return this.resource!.curr
	}

	set isEnd(newEnd: boolean) {
		this.resource!.isEnd = newEnd
	}

	get isEnd() {
		return this.resource!.isEnd
	}

	set isStart(newStart: boolean) {
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

	*[Symbol.iterator]() {
		yield* this.resource!
	}

	copy() {
		return new this.constructor(this.resource?.copy())
	}

	isCurrStart() {
		return this.resource!.isCurrStart!()
	}

	isCurrEnd() {
		return this.resource!.isCurrEnd!()
	}

	init(resource: IStream<Type>) {
		this.resource = resource
		return this
	}

	constructor(public resource?: IStream<Type>) {
		if (resource) this.init(resource)
	}
}

import type { EndableStream } from "../StreamClass/interfaces.js"
import type { NestedStream } from "./interfaces.js"
import { superInit, fastFinish } from "../StreamClass/utils.js"

export function nestedStreamInitCurr<Type = any>(this: NestedStream<Type>) {
	const ownershipType = this.typesTable.getIndex(this)
	return (this.currNested = ownershipType != undefined)
		? new this.constructor(this.value, ownershipType)
		: this.value!.curr
}

export function nestedStreamNext<Type = any>(this: NestedStream<Type>) {
	if (this.currNested) fastFinish(this.curr as EndableStream<Type>)
	this.value!.next()
	return this.initGetter!()
}

export function nestedStreamIsEnd<Type = any>(this: NestedStream<Type>) {
	return (
		this.value!.isCurrEnd() ||
		(this._index != undefined && !this.typesTable.byOwned(this)(this, this.pos))
	)
}

export function nestedStreamInitialize<Type = any>(
	this: NestedStream<Type>,
	value?: EndableStream<Type>,
	_index?: any
) {
	if (_index) this.typesTable.own(this, _index)
	if (value) superInit(this, value)
	return this
}

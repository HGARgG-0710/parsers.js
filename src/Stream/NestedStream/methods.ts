import type { EndableStream } from "../StreamClass/interfaces.js"
import type { EffectiveNestedStream } from "./interfaces.js"
import { uniFinish, superInit } from "../StreamClass/utils.js"

export function effectiveNestedStreamInitCurr<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	const ownershipType = this.typesTable.getIndex(this)
	return (this.currNested = ownershipType != undefined)
		? new this.constructor(this.value, ownershipType)
		: this.value.curr
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) uniFinish(this.curr as EndableStream<Type>)
	this.value.next()
	return this.initGetter!()
}

export function effectiveNestedStreamIsEnd<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	return (
		this.value.isCurrEnd() ||
		(this._index != null && !this.typesTable.byOwned(this)(this, this.pos))
	)
}

export function effectiveNestedStreamInitialize<Type = any>(
	this: EffectiveNestedStream<Type>,
	value?: EndableStream<Type>,
	_index?: any
) {
	if (_index) this.typesTable.own(this, _index)
	if (value) superInit(this, value)
	return this
}

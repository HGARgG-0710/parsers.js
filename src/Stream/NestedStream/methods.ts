import { uniFinish } from "../StreamClass/Finishable/utils.js"
import type { EffectiveNestedStream } from "./interfaces.js"

import { Inputted } from "../UnderStream/classes.js"
import type { EndableStream } from "../StreamClass/interfaces.js"

export function effectiveNestedStreamInitCurr<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	const result = this.typesTable.index(this.input)
	if (result) {
		this.currNested = true
		return new this.constructor(this.input, result[0])
	}
	return this.input.curr
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) {
		uniFinish(this.curr as EndableStream<Type>)
		this.currNested = false
	}
	this.input.next()
	return this.initGetter()
}

export function effectiveNestedStreamIsEnd<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	return (
		this.input.isCurrEnd() ||
		(this._index != null && !this.typesTable.byOwned(this)[1][0](this))
	)
}

export function effectiveNestedStreamInitialize<Type = any>(
	this: EffectiveNestedStream<Type>,
	input?: EndableStream<Type>,
	_index?: any
) {
	if (_index) this.typesTable.own(this, _index)
	if (input) {
		Inputted(this, input)
		this.super.init()
	}
	return this
}

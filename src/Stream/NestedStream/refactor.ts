import type { EndableStream } from "../StreamClass/interfaces.js"
import type { INestedStream } from "./interfaces.js"

import { fastFinish } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

import { type } from "@hgargg-0710/one"
const { isNullary } = type

export function nestedStreamInitCurr<Type = any>(this: INestedStream<Type>) {
	const ownershipType = this.typesTable.getIndex(this)
	return (this.currNested = !isNullary(ownershipType))
		? new this.constructor(this.value, ownershipType)
		: this.value!.curr
}

export function nestedStreamNext<Type = any>(this: INestedStream<Type>) {
	if (this.currNested) fastFinish(this.curr as EndableStream<Type>)
	this.value!.next()
	return this.initGetter!()
}

export function nestedStreamIsEnd<Type = any>(this: INestedStream<Type>) {
	const { value, typesTable } = this
	return (
		value!.isCurrEnd() ||
		(typesTable.isOwned(this) && typesTable.byOwned(this)(this, this.pos))
	)
}

export function nestedStreamInitialize<Type = any>(
	this: INestedStream<Type>,
	value?: EndableStream<Type>,
	index?: any
) {
	if (index) this.typesTable.own(this, index)
	if (value) superInit(this, value)
	return this
}

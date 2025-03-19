import type { IEndableStream } from "../StreamClass/interfaces.js"
import type { INestedStream } from "./interfaces.js"

import { finish } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

import { type } from "@hgargg-0710/one"
const { isNullary } = type

export namespace methods {
	export function initGetter<Type = any>(this: INestedStream<Type>) {
		const ownershipType = this.typesTable.getIndex(this)
		return (this.currNested = !isNullary(ownershipType))
			? new this.constructor(this.value, ownershipType)
			: this.value!.curr
	}

	export function baseNextIter<Type = any>(this: INestedStream<Type>) {
		if (this.currNested) finish(this.curr as IEndableStream<Type>)
		this.value!.next()
		return this.initGetter!()
	}

	export function isCurrEnd<Type = any>(this: INestedStream<Type>) {
		const { value, typesTable } = this
		return (
			value!.isCurrEnd() ||
			(typesTable.isOwned(this) && typesTable.byOwned(this)(this, this.pos))
		)
	}

	export function init<Type = any>(
		this: INestedStream<Type>,
		value?: IEndableStream<Type>,
		index?: any
	) {
		if (index) this.typesTable.own(this, index)
		if (value) superInit(this, value)
		return this
	}
}

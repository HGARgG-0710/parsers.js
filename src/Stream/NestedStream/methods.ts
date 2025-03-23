import type { IEndableStream } from "../StreamClass/interfaces.js"
import type { INestedStream } from "./interfaces.js"

import { finish } from "../StreamClass/utils.js"

import { type } from "@hgargg-0710/one"
import { assignIndex } from "../../utils.js"
const { isNull } = type

export namespace methods {
	export function initGetter<Type = any>(this: INestedStream<Type>) {
		const index = this.typesTable.claim(this)
		return (this.currNested = !isNull(index))
			? new this.constructor(this.value, index)
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
			(typesTable.isOwned(this) &&
				typesTable.byOwned(this)(this, this.pos))
		)
	}

	export function init<Type = any>(
		this: INestedStream<Type>,
		value?: IEndableStream<Type>,
		index?: any
	) {
		if (index) assignIndex(this, index)
		if (value) this.super.init.call(this, value)
		return this
	}
}

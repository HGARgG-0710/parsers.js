import type { IFreezableBuffer } from "../../interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import type { INestedStream, IUnderNestedStream } from "./interfaces.js"

import { assignIndex } from "../../utils.js"
import { finish } from "../utils.js"

import { type } from "@hgargg-0710/one"
const { isNull, isUndefined } = type

export namespace methods {
	export function initGetter<Type = any, IndexType = any>(
		this: INestedStream<Type, IndexType>
	) {
		const index = this.typesTable.claim(this)
		return (this.isCurrNested = !isNull(index))
			? new this.constructor(this.value, index, this.buffer?.emptied())
			: this.value!.curr
	}

	export function baseNextIter<Type = any, IndexType = any>(
		this: INestedStream<Type, IndexType>
	) {
		if (this.isCurrNested) finish(this.curr as IEndableStream<Type>)
		this.value!.next()
		return this.initGetter!()
	}

	export function isCurrEnd<Type = any, IndexType = any>(
		this: INestedStream<Type, IndexType>
	) {
		const { value, typesTable } = this
		return (
			value!.isCurrEnd() ||
			(typesTable.isOwned(this) &&
				typesTable.byOwned(this)(this, this.pos))
		)
	}

	export function init<Type = any, IndexType = any>(
		this: INestedStream<Type, IndexType>,
		value?: IUnderNestedStream<Type>,
		index?: IndexType,
		buffer?: IFreezableBuffer<Type>
	) {
		if (!isUndefined(index)) assignIndex(this, index)
		if (value) this.super.init.call(this, value, buffer)
		return this
	}

	export function copy<Type = any, IndexType = any>(
		this: INestedStream<Type, IndexType>
	) {
		return new this.constructor(
			this.value!.copy(),
			this.assignedIndex,
			this.buffer?.copy()
		)
	}
}

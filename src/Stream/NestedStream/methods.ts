import type {
	IFreezableBuffer,
	IIndexAssignable,
	ILookupTable,
	IStreamPredicate
} from "../../interfaces.js"

import type { IEndableStream, IStreamClassInstance } from "../interfaces.js"

import type { ISupered } from "../../refactor.js"

import type {
	INestedStreamInitSignature,
	IUnderNestedStream
} from "./interfaces.js"

import { assignIndex } from "../../utils.js"
import { finish } from "../utils.js"

import { type } from "@hgargg-0710/one"
const { isNull, isUndefined } = type

export namespace methods {
	export function initGetter<Type = any, IndexType = any>(
		this: INestedStreamImpl<Type, IndexType>
	) {
		const index = this.typesTable.claim(this)
		return (this.isCurrNested = !isNull(index))
			? new this.constructor(this.value, this.buffer?.emptied(), index)
			: this.value!.curr
	}

	export function baseNextIter<Type = any, IndexType = any>(
		this: INestedStreamImpl<Type, IndexType>
	) {
		if (this.isCurrNested) finish(this.curr as IEndableStream<Type>)
		this.value!.next()
		return this.initGetter!()
	}

	export function isCurrEnd<Type = any, IndexType = any>(
		this: INestedStreamImpl<Type, IndexType>
	) {
		const { value, typesTable } = this
		return (
			value!.isCurrEnd() ||
			(typesTable.isOwned(this) &&
				typesTable.byOwned(this)(this, this.pos))
		)
	}

	export function init<Type = any, IndexType = any>(
		this: INestedStreamImpl<Type, IndexType>,
		value?: IUnderNestedStream<Type>,
		buffer?: IFreezableBuffer<Type>,
		index?: IndexType
	) {
		if (!isUndefined(index)) assignIndex(this, index)
		if (value) this.super.init.call(this, value, buffer)
		return this
	}

	export function copy<Type = any, IndexType = any>(
		this: INestedStreamImpl<Type, IndexType>
	) {
		return new this.constructor(
			this.value?.copy(),
			this.buffer?.copy(),
			this.assignedIndex
		)
	}
}

export interface IISCurrNestable {
	isCurrNested: boolean
}

export interface INestedStreamImpl<Type = any, IndexType = any>
	extends IISCurrNestable,
		IStreamClassInstance<
			Type | INestedStreamImpl<Type>,
			IUnderNestedStream<Type>,
			number,
			INestedStreamInitSignature<Type, IndexType>
		>,
		ISupered,
		IIndexAssignable<IndexType> {
	["constructor"]: new (
		value?: IUnderNestedStream<Type>,
		buffer?: IFreezableBuffer<Type | INestedStreamImpl<Type, IndexType>>,
		index?: IndexType
	) => INestedStreamImpl<Type, IndexType>

	typesTable: ILookupTable<
		any,
		IStreamPredicate<Type | INestedStreamImpl<Type>>,
		IndexType
	>
}

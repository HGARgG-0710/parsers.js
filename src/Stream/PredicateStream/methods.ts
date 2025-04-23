import type { IFreezableBuffer } from "../../interfaces.js"
import type { IPredicateStreamInitSignature } from "./interfaces.js"
import type { ISupered } from "../../refactor.js"

import type {
	IReversibleStream,
	IIsEndCurrable,
	IUnderPredicateStream,
	IPredicatePosition,
	IPredicateStream,
	IStreamClassInstance
} from "../interfaces.js"
import type { IProddable } from "../refactor.js"

import type { IWithLookahead } from "../refactor.js"
import type { ILookaheadHaving } from "../refactor.js"

import { navigate } from "../utils.js"

export namespace methods {
	export function currGetter<Type = any>(this: IPredicateStreamImpl<Type>) {
		navigate(this.value!, this.predicate)
		return this.value!.curr
	}

	export function baseNextIter<Type = any>(this: IPredicateStreamImpl<Type>) {
		this.hasLookAhead = false
		return this.lookAhead
	}

	export function prod<Type = any>(this: IPredicateStreamImpl<Type>) {
		if (this.hasLookAhead) return this.lookAhead
		this.hasLookAhead = true
		this.value!.next()
		return this.curr
	}

	export function isCurrEnd<Type = any>(this: IPredicateStreamImpl<Type>) {
		this.lookAhead = this.prod()
		return this.value!.isCurrEnd()
	}

	export function init<Type = any>(
		this: IPredicateStreamImpl<Type>,
		value?: IReversibleStream<Type> & IIsEndCurrable,
		buffer?: IFreezableBuffer<Type>
	) {
		this.hasLookAhead = false
		if (value) this.super.init.call(this, value, buffer)
		return this
	}

	export function defaultIsEnd<Type = any>(this: IPredicateStreamImpl<Type>) {
		return this.value!.isEnd || !this.predicate(this, this.pos)
	}

	export function copy<Type = any>(this: IPredicateStreamImpl<Type>) {
		return new this.constructor(this.value?.copy(), this.buffer?.copy())
	}
}

export type IPredicateStreamImpl<Type = any> = IPredicateStream<Type> &
	IStreamClassInstance<
		Type,
		IUnderPredicateStream<Type>,
		number,
		IPredicateStreamInitSignature<Type>
	> &
	ISupered &
	IProddable<Type> &
	IWithLookahead<Type> &
	ILookaheadHaving & {
		["constructor"]: new (
			value?: IUnderPredicateStream<Type>,
			buffer?: IFreezableBuffer<Type>
		) => IPredicateStreamImpl<Type>

		predicate: IPredicatePosition<Type>
	}

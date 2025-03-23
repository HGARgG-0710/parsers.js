import type { IReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IIsEndCurrable } from "../StreamClass/interfaces.js"
import type { IPredicateStream } from "./interfaces.js"
import type { IFreezableBuffer } from "../../interfaces.js"

import { navigate } from "../StreamClass/utils.js"

export namespace methods {
	export function currGetter<Type = any>(this: IPredicateStream<Type>) {
		navigate(this.value!, this.predicate)
		return this.value!.curr
	}

	export function baseNextIter<Type = any>(this: IPredicateStream<Type>) {
		this.hasLookAhead = false
		return this.lookAhead
	}

	export function prod<Type = any>(this: IPredicateStream<Type>) {
		if (this.hasLookAhead) return this.lookAhead
		this.hasLookAhead = true
		this.value!.next()
		return this.curr
	}

	export function isCurrEnd<Type = any>(this: IPredicateStream<Type>) {
		this.lookAhead = this.prod()
		return this.value!.isCurrEnd() || !this.predicate(this, this.pos)
	}

	export function init<Type = any>(
		this: IPredicateStream<Type>,
		value?: IReversibleStream<Type> & IIsEndCurrable, 
		buffer?: IFreezableBuffer<Type>
	) {
		this.hasLookAhead = false
		if (value) this.super.init.call(this, value, buffer)
		return this
	}

	export function defaultIsEnd<Type = any>(this: IPredicateStream<Type>) {
		return this.value!.isEnd || !this.predicate(this, this.pos)
	}
}

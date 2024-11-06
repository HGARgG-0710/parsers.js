import type { PredicatePosition } from "../../Position/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { EffectivePredicateStream, PredicateStream } from "./interfaces.js"

import { preserveDirection } from "../../Position/utils.js"
import { uniNavigate, superInit } from "../StreamClass/utils.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	uniNavigate(this.value, this.predicate)
	return this.value.curr
}

export function effectivePredicateStreamNext<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	this.hasLookAhead = false
	return this.lookAhead
}

export function effectivePredicateStreamProd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	if (this.hasLookAhead) return this.lookAhead
	this.hasLookAhead = true
	this.value.next()
	return this.curr
}

export function effectivePredicateStreamIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	this.lookAhead = this.prod()
	return this.value.isCurrEnd() || !this.predicate(this, this.pos)
}

export function effectivePredicateStreamInitialize<Type = any>(
	this: EffectivePredicateStream<Type>,
	value?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition
) {
	if (predicate) {
		this.predicate = preserveDirection(predicate, (predicate) => predicate.bind(this))
		this.hasLookAhead = false
	}
	if (value) superInit(this, value)
	return this
}

export function effectivePredicateStreamDefaultIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	return this.value.isEnd || !this.predicate(this.curr)
}

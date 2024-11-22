import type { PredicatePosition } from "../../Position/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { PredicateStream } from "./interfaces.js"

import { preserveDirection } from "../../Position/utils.js"
import { superInit, fastNavigate } from "../StreamClass/utils.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	fastNavigate(this.value, this.predicate)
	return this.value.curr
}

export function predicateStreamNext<Type = any>(this: PredicateStream<Type>) {
	this.hasLookAhead = false
	return this.lookAhead
}

export function predicateStreamProd<Type = any>(this: PredicateStream<Type>) {
	if (this.hasLookAhead) return this.lookAhead
	this.hasLookAhead = true
	this.value.next()
	return this.curr
}

export function predicateStreamIsEnd<Type = any>(this: PredicateStream<Type>) {
	this.lookAhead = this.prod()
	return this.value.isCurrEnd() || !this.predicate(this, this.pos)
}

export function predicateStreamInitialize<Type = any>(
	this: PredicateStream<Type>,
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

export function predicateStreamDefaultIsEnd<Type = any>(this: PredicateStream<Type>) {
	return this.value.isEnd || !this.predicate(this.curr)
}

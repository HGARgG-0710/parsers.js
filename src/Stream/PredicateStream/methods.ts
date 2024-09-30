import type { EffectivePredicateStream, PredicateStream } from "./interfaces.js"
import { uniNavigate } from "../NavigableStream/utils.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { PredicatePosition } from "../PositionalStream/Position/interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { preserveDirection } from "../PositionalStream/Position/utils.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	uniNavigate(this.input, this.predicate)
	return this.input.curr
}

export function effectivePredicateStreamNext<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	++this.pos
	this.hasLookAhead = false
	return this.lookAhead
}

export function effectivePredicateStreamProd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	if (this.hasLookAhead) return this.lookAhead
	this.hasLookAhead = true
	this.input.next()
	return this.curr
}

export function effectivePredicateStreamIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	this.lookAhead = this.prod()
	return this.input.isCurrEnd() || !this.predicate(this.input)
}

export function effectivePredicateStreamInitialize<Type = any>(
	this: EffectivePredicateStream<Type>,
	input?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition
) {
	if (input) {
		Inputted(this, input)
		this.pos = 0
		this.super.init.call(this)
	}
	if (predicate) {
		this.predicate = preserveDirection(predicate, (predicate) => predicate.bind(this))
		this.hasLookAhead = false
	}
	return this
}

export function effectivePredicateStreamDefaultIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	return this.input.isEnd || !this.predicate(this.curr)
}

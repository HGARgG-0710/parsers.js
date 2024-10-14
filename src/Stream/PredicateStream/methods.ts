import type { EffectivePredicateStream, PredicateStream } from "./interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { PredicatePosition } from "../../Position/interfaces.js"
import { preserveDirection } from "../../Position/utils.js"
import { uniNavigate, superInit } from "../StreamClass/utils.js"
import { Inputted } from "../StreamClass/classes.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	uniNavigate(this.input, this.predicate)
	return this.input.curr
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
	this.input.next()
	return this.curr
}

export function effectivePredicateStreamIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	this.lookAhead = this.prod()
	return this.input.isCurrEnd() || !this.predicate(this)
}

export function effectivePredicateStreamInitialize<Type = any>(
	this: EffectivePredicateStream<Type>,
	input?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition
) {
	if (predicate) {
		this.predicate = preserveDirection(predicate, (predicate) => predicate.bind(this))
		this.hasLookAhead = false
	}
	if (input) {
		Inputted(this, input)
		superInit(this)
	}
	return this
}

export function effectivePredicateStreamDefaultIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	return this.input.isEnd || !this.predicate(this.curr)
}

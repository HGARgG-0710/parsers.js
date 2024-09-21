import type { EffectivePredicateStream, PredicateStream } from "./interfaces.js"
import { navigate } from "../NavigableStream/utils.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	navigate(this.input, this.predicate)
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

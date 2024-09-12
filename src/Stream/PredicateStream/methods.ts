import type { EffectivePredicateStream, PredicateStream } from "./interfaces.js"
import { navigate } from "../NavigableStream/utils.js"

export function predicateStreamCurr<Type = any>(this: PredicateStream<Type>) {
	navigate(this.input, this.predicate)
	return this.input.curr
}

export function predicateStreamNext<Type = any>(this: PredicateStream<Type>) {
	++this.pos
	return this.lookAhead
}

export function effectivePredicateStreamProd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	if (this.isStart || this.lookAhead === this.curr) {
		this.input.next()
		return this.curr
	}
}

export function effectivePredicateStreamIsEnd<Type = any>(
	this: EffectivePredicateStream<Type>
) {
	if (this.input.isCurrEnd()) return true
	this.lookAhead = this.prod()
	return !this.predicate(this.input)
}

import type { PredicatePosition } from "../../Position/interfaces.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IsEndCurrable } from "../StreamClass/interfaces.js"
import type { IPredicateStream } from "./interfaces.js"

import { preserveDirection } from "../../Position/utils.js"
import { fastNavigate } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/refactor.js"

import { functional } from "@hgargg-0710/one"
const { copy } = functional

export function predicateStreamCurr<Type = any>(this: IPredicateStream<Type>) {
	fastNavigate(this.value!, this.predicate)
	return this.value!.curr
}

export function predicateStreamNext<Type = any>(this: IPredicateStream<Type>) {
	this.hasLookAhead = false
	return this.lookAhead
}

export function predicateStreamProd<Type = any>(this: IPredicateStream<Type>) {
	if (this.hasLookAhead) return this.lookAhead
	this.hasLookAhead = true
	this.value!.next()
	return this.curr
}

export function predicateStreamIsEnd<Type = any>(this: IPredicateStream<Type>) {
	this.lookAhead = this.prod()
	return this.value!.isCurrEnd() || !this.predicate(this, this.pos)
}

export function predicateStreamInitialize<Type = any>(
	this: IPredicateStream<Type>,
	value?: ReversibleStream<Type> & IsEndCurrable,
	predicate?: PredicatePosition<Type>
) {
	if (predicate) {
		this.predicate = preserveDirection(
			predicate,
			(predicate) => copy(predicate, this) as PredicatePosition<Type>
		)
		this.hasLookAhead = false
	}
	if (value) superInit(this, value)
	return this
}

export function predicateStreamDefaultIsEnd<Type = any>(this: IPredicateStream<Type>) {
	return this.value!.isEnd || !this.predicate(this, this.pos)
}

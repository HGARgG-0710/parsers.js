import type { Position } from "../../Position/interfaces.js"
import type { LimitedStream, LimitedUnderStream } from "./interfaces.js"
import {
	directionCompare,
	positionConvert,
	positionEqual,
	positionNegate
} from "../../Position/utils.js"

import { Stream } from "../../constants.js"
const { LimitedStream } = Stream

import { fastNavigate } from "../StreamClass/utils.js"
import { superInit } from "../StreamClass/utils.js"

import { typeof as type } from "@hgargg-0710/one"
const { isUndefined } = type

export function limitedStreamNext<Type = any>(this: LimitedStream<Type>) {
	this.hasLookAhead = false
	return this.lookAhead
}

export function limitedStreamProd<Type = any>(this: LimitedStream<Type>) {
	if (!this.hasLookAhead) {
		this.hasLookAhead = true
		this.value[this.direction ? "next" : "prev"]()
		return this.value.curr
	}
	return this.lookAhead
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	if (this.value.isCurrEnd()) return true
	this.lookAhead = this.prod()
	return positionEqual(this.value, this.to)
}

export function limitedStreamIsStart<Type = any>(this: LimitedStream<Type>) {
	return this.value.isCurrStart() || positionEqual(this.value, this.from)
}

export function limitedStreamPrev<Type = any>(this: LimitedStream<Type>) {
	this.lookAhead = this.curr
	this.hasLookAhead = true
	this.value[this.direction ? "prev" : "next"]()
	return this.value.curr
}

export function limitedStreamInitialize<Type = any>(
	this: LimitedStream<Type>,
	value: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) {
	this.hasLookAhead = false

	if (!isUndefined(from)) {
		if (isUndefined(to)) {
			to = from
			from = LimitedStream.NoMovementPredicate
		}

		fastNavigate(this.value, from)

		this.direction = directionCompare(from, to, this.value)
		this.from = from
		this.to = positionNegate(positionConvert(this.to, this.value))
	}

	superInit(this, value)
	return this
}

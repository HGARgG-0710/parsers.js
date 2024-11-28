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
	const { value, direction, hasLookAhead, lookAhead } = this
	if (!hasLookAhead) {
		this.hasLookAhead = true
		value![direction ? "next" : "prev"]()
		return value!.curr
	}
	return lookAhead
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	const { value, to } = this
	if (value!.isCurrEnd()) return true
	this.lookAhead = this.prod()
	return positionEqual(value!, to)
}

export function limitedStreamIsStart<Type = any>(this: LimitedStream<Type>) {
	const { value, from } = this
	return value!.isCurrStart() || positionEqual(value!, from)
}

export function limitedStreamPrev<Type = any>(this: LimitedStream<Type>) {
	const { curr, direction, value } = this
	this.lookAhead = curr
	this.hasLookAhead = true
	value![direction ? "prev" : "next"]()
	return value!.curr
}

export function limitedStreamInitialize<Type = any>(
	this: LimitedStream<Type>,
	value?: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) {
	if (value || this.value) {
		if (value) superInit(this, value)

		this.hasLookAhead = false

		if (!isUndefined(from)) {
			if (isUndefined(to)) {
				to = from
				from = LimitedStream.NoMovementPredicate
			}

			fastNavigate(this.value!, from)

			this.direction = directionCompare(from, to, this.value)
			this.from = from
			this.to = positionNegate(positionConvert(to, this.value))
		}
	}
	return this
}

import type { Position } from "../../Position/interfaces.js"
import type {
	EffectiveLimitedStream,
	LimitedUnderStream
} from "./interfaces.js"
import {
	directionCompare,
	positionConvert,
	positionEqual,
	positionNegate
} from "../../Position/utils.js"

import { fastNavigate } from "../StreamClass/utils.js"

import { Inputted } from "../StreamClass/classes.js"
import { superInit } from "../StreamClass/utils.js"

import { typeof as type } from "@hgargg-0710/one"
import { LimitedStream } from "src/constants.js"
const { isUndefined } = type

export function effectiveLimitedStreamNext<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	this.hasLookAhead = false
	return this.lookAhead
}

export function effectiveLimitedStreamProd<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	if (!this.hasLookAhead) {
		this.hasLookAhead = true
		this.input[this.direction ? "next" : "prev"]()
		return this.input.curr
	}
	return this.lookAhead
}

export function effectiveLimitedStreamIsEnd<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	if (this.input.isCurrEnd()) return true
	this.lookAhead = this.prod()
	return positionEqual(this.input, this.to)
}

export function effectiveLimitedStreamIsStart<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	return this.input.isCurrStart() || positionEqual(this.input, this.from)
}

export function effectiveLimitedStreamPrev<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	this.lookAhead = this.curr
	this.hasLookAhead = true
	this.input[this.direction ? "prev" : "next"]()
	return this.input.curr
}

export function effectiveLimitedStreamInitialize<Type = any>(
	this: EffectiveLimitedStream<Type>,
	input?: LimitedUnderStream<Type>,
	from?: Position,
	to?: Position
) {
	if (input) {
		Inputted(this, input)
		this.hasLookAhead = false

		if (!isUndefined(from)) {
			if (isUndefined(to)) {
				to = from
				from = LimitedStream.NoMovementPredicate
			}

			fastNavigate(input, from)

			this.direction = directionCompare(from, to, this.input)
			this.from = from
			this.to = positionNegate(positionConvert(this.to, this.input))
		}

		superInit(this)
	}

	return this
}

import { boolean } from "@hgargg-0710/one"
const { T } = boolean

import type { Position } from "../PositionalStream/Position/interfaces.js"
import {
	directionCompare,
	positionConvert,
	positionEqual,
	positionNegate
} from "../PositionalStream/Position/utils.js"

import { fastNavigate } from "../StreamClass/Navigable/utils.js"

import { LimitedStream as LimitedStreamConstructor } from "./classes.js"
import type {
	BoundableStream,
	EffectiveLimitedStream,
	LimitedUnderStream
} from "./interfaces.js"
import { Inputted } from "../UnderStream/classes.js"
import { superInit } from "../StreamClass/Superable/utils.js"

export function limitStream<Type = any>(
	this: BoundableStream<Type>,
	from?: Position,
	to?: Position
) {
	return new LimitedStreamConstructor<Type>(this, from, to)
}

export function effectiveLimitedStreamNext<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	++this.pos
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
	--this.pos
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
	this.pos = 0

	if (input) {
		Inputted(this, input)
		this.hasLookAhead = false

		if (from !== undefined) {
			if (to === undefined) {
				to = from
				from = T // explanation: the 'from = T' will cause expression 'while (!from(stream)) stream.next()' become 'while (false) stream.next()', essentially being a no-op;
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

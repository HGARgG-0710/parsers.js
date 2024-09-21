import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import {
	directionCompare,
	positionConvert,
	positionEqual,
	positionNegate
} from "../PositionalStream/Position/utils.js"
import { LimitedStream as LimitedStreamConstructor } from "./classes.js"
import type {
	BoundableStream,
	EffectiveLimitedStream,
	LimitedStream
} from "./interfaces.js"

export function limitStream<Type = any>(this: BoundableStream<Type>, dual: DualPosition) {
	return LimitedStreamConstructor<Type>(this, dual)
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
		this.input[directionCompare(this.from, this.to, this.input) ? "next" : "prev"]()
		return this.input.curr
	}
	return this.lookAhead
}

export function effectiveLimitedStreamIsEnd<Type = any>(
	this: EffectiveLimitedStream<Type>
) {
	if (this.input.isCurrEnd()) return true
	this.lookAhead = this.prod()
	return positionEqual(this.input, positionNegate(positionConvert(this.to, this.input)))
}

export function limitedStreamNavigate<Type = any>(
	this: LimitedStream<Type>,
	position: Position
) {
	const fromConverted = positionConvert(this.from) as number
	position = positionConvert(position)
	return this.input.navigate(
		isNumber(position) ? Math.max(fromConverted + position, fromConverted) : position
	)
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
	this.input[directionCompare(this.from, this.to, this.input) ? "prev" : "next"]()
	return this.input.curr
}

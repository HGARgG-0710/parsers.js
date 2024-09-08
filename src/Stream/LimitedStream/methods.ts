import { typeof as type } from "@hgargg-0710/one"
const { isNumber } = type

import type { DualPosition, Position } from "../PositionalStream/Position/interfaces.js"
import {
	positionCheck,
	positionCompare,
	positionConvert,
	positionEqual
} from "../PositionalStream/Position/utils.js"
import { LimitedStream as LimitedStreamConstructor } from "./classes.js"
import type { BoundableStream, LimitedStream } from "./interfaces.js"

export function limitStream<Type = any>(this: BoundableStream<Type>, dual: DualPosition) {
	return LimitedStreamConstructor<Type>(this, dual)
}

export function limitedStreamNext<Type = any>(this: LimitedStream<Type>) {
	return positionCompare(this.from, this.to, this.input)
		? this.input.next()
		: this.input.prev()
}

export function limitedStreamIsEnd<Type = any>(this: LimitedStream<Type>) {
	return this.input.isCurrEnd() || !positionCheck(this.input, this.to)
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
}export function limitedStreamIsStartGetter<Type = any>(this: LimitedStream<Type>) {
	return this.input.isCurrStart() || positionEqual(this.input, this.from)
}
export function limitedStreamPrev<Type = any>(this: LimitedStream<Type>) {
	return positionCompare(this.from, this.to, this.input)
		? this.input.prev()
		: this.input.next()
}


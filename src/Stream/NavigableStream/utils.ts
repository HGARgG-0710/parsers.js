import { iterationChoice, positionNegate } from "../PositionalStream/Position/utils.js"
import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { Navigable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isNavigable = structCheck<Navigable>({ navigate: isFunction })

export function navigate<Type = any>(stream: ReversibleStream<Type>, position: Position) {
	const [change, endPredicate] = iterationChoice(
		positionNegate(positionConvert(position, stream))
	)
	let i = 0
	while (endPredicate(stream, i)) change(stream)
	return stream.curr
}

export function uniNavigate<Type = any>(
	stream: ReversibleStream<Type>,
	position: Position
): Type {
	if (isNavigable(stream)) return stream.navigate(position)
	return navigate(stream, position)
}

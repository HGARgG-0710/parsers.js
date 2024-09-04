import { iterationChoice } from "../PositionalStream/Position/utils.js"
import type { ReversibleStream } from "main.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { Navigable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isNavigable = structCheck<Navigable>({ navigate: isFunction })

export function uniNavigate<Type = any>(
	stream: ReversibleStream<Type>,
	position: Position
): Type {
	if (isNavigable(stream)) return stream.navigate(position)
	const [change, endPredicate] = iterationChoice(positionConvert(position))
	while (!endPredicate) change(stream)
	return stream.curr
}

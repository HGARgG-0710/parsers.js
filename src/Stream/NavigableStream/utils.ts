import { positionNegate } from "../PositionalStream/Position/utils.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { Navigable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
import { skip } from "src/Parser/utils.js"
const { structCheck } = object
const { isFunction } = type

export const isNavigable = structCheck<Navigable>({ navigate: isFunction })

/**
 * Skips inside the given `ReversibleStream` up to the nearest point
 * defined by the given `Position`.
 * Can be inefficient for certain types of `Stream`s. 
 * Consider using `uniNavigate` instead
 */
export function navigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
) {
	skip(stream, positionNegate(positionConvert(position, stream)))
	return stream.curr
}

/**
 * Performs a universal `navigate` operation on a given `ReversibleStream`.
 * If it is `Navigable`, returns `stream.navigate(position)`, otherwise returns
 * `navigate(stream, position)`.
 */
export function uniNavigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
): Type {
	return isNavigable(stream) ? stream.navigate(position) : navigate(stream, position)
}

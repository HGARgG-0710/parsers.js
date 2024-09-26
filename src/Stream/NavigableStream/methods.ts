import type { Position } from "../PositionalStream/Position/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"

import { uniNavigate } from "./utils.js"

/**
 * A definition of `.navigate` method that workd for any `Stream`
 * 		(used as default, rewritten occasionally to save time)
 */
export function navigate<Type = any>(
	this: BasicReversibleStream<Type>,
	position: Position
) {
	return uniNavigate(this, position)
}

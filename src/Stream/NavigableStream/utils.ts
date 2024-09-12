import { positionNegate } from "../PositionalStream/Position/utils.js"
import type {
	GeneralReversibleStream,
	ReversibleStream
} from "../ReversibleStream/interfaces.js"
import type { Position } from "../PositionalStream/Position/interfaces.js"
import { positionConvert } from "../PositionalStream/Position/utils.js"
import type { Navigable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
import { skip } from "src/Parser/utils.js"
const { structCheck } = object
const { isFunction } = type

export const isNavigable = structCheck<Navigable>({ navigate: isFunction })

export function navigate<Type = any>(
	stream: GeneralReversibleStream<Type>,
	position: Position
) {
	skip(stream, positionNegate(positionConvert(position, stream)))
	return stream.curr
}

export function uniNavigate<Type = any>(
	stream: ReversibleStream<Type>,
	position: Position
): Type {
	if (isNavigable(stream)) return stream.navigate(position)
	return navigate(stream, position)
}

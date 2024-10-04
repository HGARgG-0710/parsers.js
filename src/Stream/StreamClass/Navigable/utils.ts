import { pickDirection, positionConvert } from "../../PositionalStream/Position/utils.js"
import type { Navigable } from "./interfaces.js"

import type { Position } from "../../PositionalStream/Position/interfaces.js"
import type { BasicReversibleStream } from "../../ReversibleStream/interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber } = type

export const isNavigable = structCheck<Navigable>({ navigate: isFunction })

/**
 * General implementation of the 'navigate' operation for a given `stream`
 * (note: when available, calling `stream.navigate()` is typically faster);
 *
 * Provided with a `Stream` and a `Position`, it:
 *
 * * 1. converts all the `PositionObject`-s into `DirectionalPosition`-s;
 * * 2. if the result of the conversion is `number` and it is negative, calls the `stream.prev()` this many times;
 * * 3. if the result of the conversion is `number` and it is positive, calls the `stream.next()` this many times;
 * * 4. if the result of the conversion is `PredicatePosition`, continues to walk the stream until either it is over, or the condition given is met;
 * @returns `stream.curr`
 */
export function uniNavigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
): Type {
	if (isNumber((position = positionConvert(position, stream)))) {
		if (position < 0) while (position++) stream.prev()
		else while (position--) stream.next()
	} else {
		const change = pickDirection(position)
		while (!stream.isEnd && !position(this)) change(this)
	}

	return stream.curr
}

export function fastNavigate<Type = any>(
	stream: BasicReversibleStream<Type>,
	position: Position
) {
	return isNavigable(stream)
		? stream.navigate(position)
		: uniNavigate<Type>(stream, position)
}

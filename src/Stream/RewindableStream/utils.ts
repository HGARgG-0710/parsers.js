import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Rewindable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })

/**
 * Function for returning back to the beginning of the given `ReversibleStream`.
 * Can be very inefficient for certain types of Stream.
 * Consider using `uniRewind` instead.
 */
export function rewind<Type = any>(stream: ReversibleStream<Type>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

/**
 * Performs a universal `rewind`ing operaion on the given `ReversibleStream`.
 * If it is `Rewindable`, calls the `stream.rewind()` method and returns the result,
 * otherwise, calls the `rewind(stream)`
 */
export function uniRewind<Type = any>(stream: ReversibleStream<Type>) {
	return isRewindable(stream)
		? (stream as Rewindable<Type>).rewind()
		: rewind<Type>(stream)
}

import type { BasicReversibleStream } from "../../ReversibleStream/interfaces.js"
import type { Rewindable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })

/**
 * Performs a universal `rewind`ing operaion on the given `ReversibleStream`.
 * Continues to call '.prev()' on the given `Stream`, until `stream.isStart` is true;
 * @returns `stream.curr`
 */
export function uniRewind<Type = any>(stream: BasicReversibleStream<Type>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

export function fastRewind<Type = any>(stream: BasicReversibleStream<Type>): Type {
	return isRewindable(stream) ? stream.rewind() : uniRewind(stream)
}

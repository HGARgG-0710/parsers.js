import type { ReversibleStream } from "../ReversibleStream/interfaces.js"
import type { Rewindable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isRewindable = structCheck<Rewindable>({ rewind: isFunction })
export function rewind<Type = any>(stream: ReversibleStream<Type>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

export function uniRewind<Type = any>(stream: ReversibleStream<Type>) {
	return isRewindable(stream)
		? (stream as Rewindable<Type>).rewind()
		: rewind<Type>(stream)
}

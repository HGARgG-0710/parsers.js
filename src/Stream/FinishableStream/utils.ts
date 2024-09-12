import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Finishable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isFinishable = structCheck<Finishable>({ finish: isFunction })

/**
 * Iterates the given `BasicStream` until hitting the end.
 * Can be very ineffcient for certain kinds of `Stream`s. 
 * Consider using `uniFinish` instead. 
 */
export function finish<Type = any>(stream: BasicStream<Type>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

/**
 * Performs a universal `finish` operation on the given `BasicStream`.
 * If the stream is `Finishable`, returns `stream.finish()`,
 * otherwise returns `finish(stream)`
 */
export function uniFinish<Type = any>(stream: BasicStream<Type>) {
	return isFinishable(stream) ? stream.finish() : finish(stream)
}

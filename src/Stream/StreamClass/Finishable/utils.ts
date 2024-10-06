import type { BasicStream } from "src/Stream/interfaces.js"
import type { Finishable } from "./interfaces.js"

import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction } = type

export const isFinishable = structCheck<Finishable>({ finish: isFunction })

/**
 * Iterates the given `BasicStream` until hitting the end.
 * When an alternative `.finish()` method is present, it is likely faster.
 */
export function uniFinish<Type = any>(stream: BasicStream<Type>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

export function fastFinish<Type = any>(stream: BasicStream<Type>) {
	return isFinishable(stream) ? stream.finish() : uniFinish<Type>(stream)
}

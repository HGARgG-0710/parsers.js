import type { BasicStream } from "./interfaces.js"
import type { ReversibleStream } from "./ReversibleStream/interfaces.js"

import { Stream } from "../constants.js"
const { SkippedItem } = Stream.StreamParser

import { object } from "@hgargg-0710/one"
const { prop } = object

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export const next = <Type = any>(input: BasicStream<Type>) => input.next()

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export const previous = <Type = any>(input: ReversibleStream<Type>) => input.prev()

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const current = prop("curr") as <Type = any>(x: BasicStream<Type>) => Type

/**
 * Given a `handler` function, returns a function of `input: BasicStream` that
 * skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped<Type = any, OutType = any>(
	handler: (input: BasicStream<Type>) => OutType
) {
	return function (input: BasicStream<Type>) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Returns the value of `.isEnd` property of the given `BasicStream`
 */
export const isEnd = prop("isEnd") as <Type = any>(x: BasicStream<Type>) => boolean

/**
 * Returns the value of the `.isStart` property of the given `BasicStream`
 */
export const isStart = prop("isStart") as <Type = any>(x: BasicStream<Type>) => boolean

/**
 * Calls `input.next()`, and returns `SkippedItem`.
 *
 * * Note: particularly useful in combination with `StreamParser`,
 * as it allows one to take specific elements of the stream out
 * from the final input
 */
export function destroy<Type = any>(input: BasicStream<Type>): typeof SkippedItem {
	input.next()
	return SkippedItem
}

export * as InputStream from "./InputStream/utils.js"
export * as StreamClass from "./StreamClass/utils.js"

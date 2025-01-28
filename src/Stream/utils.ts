import type { BasicStream } from "./interfaces.js"
import type { BasicReversibleStream } from "./ReversibleStream/interfaces.js"

import { Stream } from "../constants.js"
import { propByName } from "./refactor.js"
const { SkippedItem } = Stream.StreamParser

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export const next = <Type = any>(input: BasicStream<Type>) => input.next()

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export const previous = <Type = any>(input: BasicReversibleStream<Type>) => input.prev()

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const current = <Type = any>(input: BasicStream<Type>) => input.curr

/**
 * Given a `handler` function returns a function of `input: BasicStream` that skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped(handler: (input: BasicStream) => any) {
	return function (input: BasicStream) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Returns the `.is` property of a given object
 */
export const is = propByName("is")

/**
 * Returns the `.isEnd` property of a given `BasicStream`
 */
export const isEnd = propByName("isEnd")

/**
 * Returns the `.isStart` property of a given `ReversibleStream`
 */
export const isStart = propByName("isStart")

/**
 * Skips a single element of the given `BasicStream` and returns an empty array
 */
export const destroy = (input: BasicStream) => {
	input.next()
	return SkippedItem
}

export * as InputStream from "./InputStream/utils.js"
export * as StreamClass from "./StreamClass/utils.js"

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
 * Given a `handler` function returns a function of `input: BasicStream` that skips a single stream-element before and after calling the handler.
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

export const is = prop("is")

export const isEnd = prop("isEnd") as <Type = any>(x: BasicStream<Type>) => boolean

export const isStart = prop("isStart") as <Type = any>(x: BasicStream<Type>) => boolean

export function destroy<Type = any>(input: BasicStream<Type>) {
	input.next()
	return SkippedItem
}

export * as InputStream from "./InputStream/utils.js"
export * as StreamClass from "./StreamClass/utils.js"

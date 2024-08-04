// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { StreamHandler, StreamPredicate } from "./parsers.js"
import type { BasicStream } from "./types.js"
import type { Collection } from "./types/Collection.js"

export const next = (input: BasicStream) => input.next()
export const current = (input: BasicStream) => input.curr()
export const output = (x: any) => [x]
export function wrapped(handler: (input: BasicStream) => any) {
	return function (input: BasicStream) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

export const is = (x: any) => x.is

export const push = (x: Collection, ...y: any[]) => x.push(...y)

export const isEnd = (input: BasicStream) => input.isEnd()
export const previous = (input: BasicStream) => input.prev()
export const destroy = (input: BasicStream) => {
	input.next()
	return []
}
export const forward = (input: BasicStream) => (input.isEnd() ? [] : [input.next()])
export const skipArg =
	(pred: number | StreamPredicate) => (f: StreamHandler) => (input: BasicStream) =>
		[pred, f(input)]

export const preserve = (input: BasicStream) => (input.isEnd() ? [] : [input.curr()])
export const miss = () => []
export const not = (x: any) => !x

export const firstFinished = ({ streams }) => streams[0].isEnd()
// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { ParsingPredicate, Pushable, TableParser } from "./parsers.js"
import type { Concattable, Stream } from "./types.js"

export const next = (input: Stream) => input.next()
export const current = (input: Stream) => input.curr()
export const output = (x: any) => [x]
export function wrapped(handler: (input: Stream) => any) {
	return function (input: Stream) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

export const is = (x: any) => x.is

export const push = (x: Pushable, ...y: any[]) => x.push(...y)
export const concat = (x: Concattable, ...y: any[]) => x.concat(...y)

export const isEnd = (input: Stream) => input.isEnd()
export const previous = (input: Stream) => input.prev()
export const destroy = (input: Stream) => {
	input.next()
	return []
}
export const forward = (input: Stream) => (input.isEnd() ? [] : [input.next()])
export const skipArg =
	(pred: number | ParsingPredicate) => (f: TableParser) => (input: Stream) =>
		[pred, f(input)]

export const preserve = (input: Stream) => (input.isEnd() ? [] : [input.curr()])
export const miss = () => []
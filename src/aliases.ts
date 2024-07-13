// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { ParsingPredicate, TableParser } from "./parsers.js"
import type { BasicStream } from "./types.js"

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

export const push = (x: Pushable, ...y: any[]) => x.push(...y)
export const concat = (x: Concattable, ...y: any[]) => x.concat(...y)

export const isEnd = (input: BasicStream) => input.isEnd()
export const previous = (input: BasicStream) => input.prev()
export const destroy = (input: BasicStream) => {
	input.next()
	return []
}
export const forward = (input: BasicStream) => (input.isEnd() ? [] : [input.next()])
export const skipArg =
	(pred: number | ParsingPredicate) => (f: TableParser) => (input: BasicStream) =>
		[pred, f(input)]

export const preserve = (input: BasicStream) => (input.isEnd() ? [] : [input.curr()])
export const miss = () => []
export const not = (x: any) => !x

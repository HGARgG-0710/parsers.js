// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { ParsingState } from "./Parser/GeneralParser/interfaces.js"
import type { StreamHandler } from "./Parser/ParserMap/interfaces.js"

import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { PredicatePosition } from "src/Stream/PositionalStream/Position/interfaces.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"

import type { HasType } from "./IndexMap/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"

export const next = (input: BasicStream) => input.next()
export const current = (input: BasicStream) => input.curr
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

export const isEnd = (input: BasicStream) => input.isEnd
export const isStart = (input: ReversibleStream) => input.isStart
export const previous = (input: ReversibleStream) => input.prev()
export const destroy = (input: BasicStream) => {
	input.next()
	return []
}
export const forward = (input: BasicStream) => (input.isEnd ? [] : [input.next()])
export const skipArg = (pred: Position) => (f: StreamHandler) => (input: BasicStream) =>
	[pred, f(input)]

export const preserve = (input: BasicStream) => (input.isEnd ? [] : [input.curr])
export const miss = () => []

export const firstStream = ({ streams }: ParsingState) => (streams as BasicStream[])[0]

export const eq = (x: any) => (y: any) => x === y
export const inSet = (set: HasType) => (x: any) => set.has(x)

export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

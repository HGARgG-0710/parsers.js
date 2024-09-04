// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { ParsingState, StreamHandler } from "./parsers.js"

import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { PredicatePosition } from "src/Stream/PositionalStream/Position/interfaces.js"
import type { Position } from "src/Stream/PositionalStream/Position/interfaces.js"

import type { HasType } from "./interfaces/misc.js"
import type { PreBasicStream } from "src/Stream/PreBasicStream/interfaces.js"
import type { ReversibleStream } from "src/Stream/ReversibleStream/interfaces.js"

export const next = (input: PreBasicStream) => input.next()
export const current = (input: PreBasicStream) => input.curr
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

export const firstStream = ({ streams }: ParsingState) => streams[0]

export const eq = (x: any) => (y: any) => x === y
export const inSet = (set: HasType) => (x: any) => set.has(x)

export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

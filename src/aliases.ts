// * Aliases file (main purpose of its is to allow parsers to be written in a more functional style).

import type { StreamHandler } from "./parsers.js"
import type { Collection } from "./types/Collection.js"

import type { BasicStream } from "./types/Stream/BasicStream.js"
import type { Position, PredicatePosition } from "./types/Stream/Position.js"

import type { HasType } from "./types/IndexMap.js"
import type { PreBasicStream } from "./types/Stream/PreBasicStream.js"
import type { ReversibleStream } from "./types/Stream/ReversibleStream.js"

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
export const push = (x: Collection, ...y: any[]) => x.push(...y)

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

export const firstFinished = ({ streams }) => streams[0].isEnd
export const firstStream = ({ streams }) => streams[0]

export const eq = (x: any) => (y: any) => x === y
export const not = (x: any) => !x
export const inSet = (set: HasType) => (x: any) => set.has(x)

export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

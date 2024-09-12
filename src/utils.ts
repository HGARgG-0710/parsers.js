import type { Summat } from "@hgargg-0710/summat.ts"
import type { HasType } from "./IndexMap/interfaces.js"
import type { ParsingState } from "./Parser/GeneralParser/interfaces.js"
import type { StreamHandler } from "./Parser/ParserMap/interfaces.js"
import type { BasicStream } from "./Stream/BasicStream/interfaces.js"
import type {
	Position,
	PredicatePosition
} from "./Stream/PositionalStream/Position/interfaces.js"
import type { ReversibleStream } from "./Stream/ReversibleStream/interfaces.js"

/**
 * Given a string, returns whether it's a Hex number
 */
export const isHex = (x: string) => /^[0-9A-Fa-f]+$/.test(x)

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
export const current = <Type = any>(input: BasicStream<Type>) => input.curr

/**
 * Returns `[x]`
 */
export const output = (x: any) => [x]

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
export const is = (x: Summat) => x.is

/**
 * Returns the `.isEnd` property of a given `BasicStream`
 */
export const isEnd = (input: BasicStream) => input.isEnd

/**
 * Returns the `.isStart` property of a given `ReversibleStream`
 */
export const isStart = (input: ReversibleStream) => input.isStart

/**
 * Skips a single element of the given `BasicStream` and returns an empty array
 */
export const destroy = (input: BasicStream) => {
	input.next()
	return []
}

/**
 * For a `input: BasicStream`, If `input.isEnd`, returns an empty array, otherwise `[input.next()]`
 */
export const forward = (input: BasicStream) => (input.isEnd ? [] : [input.next()])

/**
 * For a given position `pred`, returns a predicate of `f: StreamHandler`, returning a predicate of `input: BasicStream`,
 * returning [pred, f(input)]
 */
export const skipArg = (pred: Position) => (f: StreamHandler) => (input: BasicStream) =>
	[pred, f(input)]

/**
 * If `input.isEnd`, returns the empty array, otherwise `[input.curr]`
 */
export const preserve = <Type = any>(input: BasicStream<Type>) =>
	input.isEnd ? [] : [input.curr]

/**
 * Creates and returns a new empty array
 */
export const miss = () => []

/**
 * Returns the `.streams[0]` in a given `ParsingState`
 */
export const firstStream = ({ streams }: ParsingState) => (streams as BasicStream[])[0]

/**
 * Returns whether `x === y`
 */
export const eq = (x: any) => (y: any) => x === y

/**
 * Returns whether `set.has(x)`
 */
export const inSet = (set: HasType) => (x: any) => set.has(x)

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export const backtrack = (predicate: PredicatePosition) => {
	predicate.direction = false
	return predicate
}

export * as IndexMap from "./IndexMap/utils.js"
export * as Parser from "./Parser/utils.js"
export * as Pattern from "./Pattern/utils.js"
export * as Stream from "./Stream/utils.js"
export * as Tree from "./Tree/utils.js"

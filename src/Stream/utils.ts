import type { IBasicStream } from "./interfaces.js"
import type { IReversibleStream } from "./ReversibleStream/interfaces.js"

import type {
	IStreamPredicate,
	IStreamTransform
} from "../TableMap/interfaces.js"

import type {
	ICollection,
	IDirectionalPosition,
	IPosition
} from "../interfaces.js"

import { Stream } from "../constants.js"
const { SkippedItem } = Stream.StreamParser

import { positionNegate } from "../Position/utils.js"
import { uniNavigate } from "./StreamClass/utils.js"
import { ArrayCollection } from "../Collection/classes.js"
import { getStopPoint } from "../Position/refactor.js"

import { object } from "@hgargg-0710/one"
const { prop } = object

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export const next = <Type = any>(input: IBasicStream<Type>) => input.next()

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export const previous = <Type = any>(input: IReversibleStream<Type>) =>
	input.prev()

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const current = prop("curr") as <Type = any>(
	x: IBasicStream<Type>
) => Type

/**
 * Given a `handler` function, returns a function of `input: BasicStream` that
 * skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped<Type = any, OutType = any>(
	handler: (input: IBasicStream<Type>) => OutType
) {
	return function (input: IBasicStream<Type>) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Returns the value of `.isEnd` property of the given `BasicStream`
 */
export const isEnd = prop("isEnd") as <Type = any>(
	x: IBasicStream<Type>
) => boolean

/**
 * Returns the value of the `.isStart` property of the given `BasicStream`
 */
export const isStart = prop("isStart") as <Type = any>(
	x: IBasicStream<Type>
) => boolean

/**
 * Calls `input.next()`, and returns `SkippedItem`.
 *
 * * Note: particularly useful in combination with `StreamParser`,
 * as it allows one to take specific elements of the stream out
 * from the final input
 */
export function destroy<Type = any>(
	input: IBasicStream<Type>
): typeof SkippedItem {
	input.next()
	return SkippedItem
}

/**
 * A polymorphic method for skipping the number of steps inside `input`
 * specified by the `steps` (default - `1`)
 */
export function skip(input: IReversibleStream, steps: IPosition = 1) {
	return uniNavigate(input, positionNegate(steps))
}

/**
 * Collects contigiously the items of `stream` into `init`, starting from `stream.curr`,
 * consuming the items added in the process
 */
export function consume<
	Type = any,
	CollectionType extends ICollection<Type> = ArrayCollection<Type>
>(
	stream: IBasicStream<Type>,
	init: CollectionType = new ArrayCollection<Type>() as any
) {
	while (!stream.isEnd) init.push(stream.next())
	return init
}

/**
 * Navigates up to the desired position on the given `Stream`,
 * returns whether the bound corresponding to the direction of iteration
 * has been reached
 */
export function has(pos: IDirectionalPosition) {
	const stopPoint = getStopPoint(pos)
	return function <Type = any>(input: IReversibleStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`
 */
export function count(pred: IStreamPredicate) {
	return function <Type = any>(input: IBasicStream<Type>) {
		let count = 0
		while (!input.isEnd && pred(input, count)) {
			++count
			input.next()
		}
		return count
	}
}

/**
 * Returns a function that collects the items of `input`
 * into `init`, delimiting them by `delimPred`
 */
export function delimited(delimPred: IPosition) {
	return function <
		Type = any,
		CollectionType extends ICollection<Type> = ArrayCollection<Type>
	>(
		input: IReversibleStream<Type>,
		init: CollectionType = new ArrayCollection<Type>() as any
	) {
		while (!input.isEnd) {
			skip(input, delimPred)
			init.push(input.next())
		}
		return init
	}
}

/**
 * Returns a function that collects the results of `map(input, i++)`
 * with running index `i = 0`, starting from `input.curr`, until
 * the moment that `input.isEnd`
 */
export function transform<UnderType = any, UpperType = any>(
	map: IStreamTransform<UnderType, UpperType>
) {
	return function <
		CollectionType extends ICollection<UpperType> = ArrayCollection<UpperType>
	>(
		input: IBasicStream<UnderType>,
		init: CollectionType = new ArrayCollection<UpperType>() as any
	) {
		let i = 0
		while (!input.isEnd) init.push(map(input, i++))
		return init
	}
}

export * as InputStream from "./InputStream/utils.js"
export * as StreamClass from "./StreamClass/utils.js"

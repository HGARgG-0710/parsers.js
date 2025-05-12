import { functional, object, type } from "@hgargg-0710/one"
import type {
	IStreamPredicate,
	IStreamTransform
} from "../interfaces/StreamHandler.js"
import { ArrayCollection } from "../classes/ArrayCollection.js"
import { Stream } from "../constants.js"
import type {
	IBufferized,
	IClearable,
	IFiniteWritable,
	IIndexed,
	IPosition,
	IPushable,
	IStateful
} from "../interfaces.js"
import {
	direction,
	pickDirection,
	positionNegate
} from "../Stream/utils/Position.js"
import type {
	IBackward,
	IFinishable,
	INavigable,
	IPosed,
	IPrevable,
	IReversibleStream,
	IRewindable,
	IStarted,
	IStream
} from "../interfaces/Stream.js"

const { SkippedItem } = Stream.StreamParser
const { prop, structCheck } = object
const { isFunction, isNumber, isBoolean, isObject } = type
const { and } = functional

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export const next = <Type = any>(input: IStream<Type>) => input.next()

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export const previous = <Type = any>(input: IReversibleStream<Type>) =>
	input.prev()

/**
 * Given a `BasicStream` returns its `.curr` property value
 */
export const current = prop("curr") as <Type = any>(x: IStream<Type>) => Type

/**
 * Given a `handler` function, returns a function of `input: BasicStream` that
 * skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped<Type = any, OutType = any>(
	handler: (input: IStream<Type>) => OutType
) {
	return function (input: IStream<Type>) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Returns the value of `.isEnd` property of the given `BasicStream`
 */
export const isEnd = prop("isEnd") as <Type = any>(x: IStream<Type>) => boolean

/**
 * Returns the value of the `.isStart` property of the given `BasicStream`
 */
export const isStart = prop("isStart") as <Type = any>(
	x: IStream<Type>
) => boolean

/**
 * Calls `input.next()`, and returns `SkippedItem`.
 *
 * * Note: particularly useful in combination with `StreamParser`,
 * as it allows one to take specific elements of the stream out
 * from the final input
 */
export function destroy<Type = any>(input: IStream<Type>): typeof SkippedItem {
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
export function consume<Type = any>(
	stream: IStream<Type>,
	result: IPushable<Type> = new ArrayCollection<Type>()
) {
	while (!stream.isEnd) result.push(stream.next())
	return result
}

export function write<Type = any>(
	stream: IStream<Type>,
	result: IFiniteWritable<Type>
) {
	for (let i = 0; i < result.size && !stream.isEnd; ++i)
		result.write(i, stream.next())
	return result
}

export function consumable<Type = any>(result: IPushable<Type> & IClearable) {
	return function (stream: IStream<Type>) {
		result.clear()
		while (!stream.isEnd) result.push(stream.curr)
		return result
	}
}

/**
 * Navigates up to the desired position on the given `Stream`,
 * returns whether the bound corresponding to the direction of iteration
 * has been reached
 */
export function has(pos: IPosition) {
	const stopPoint = direction(pos) ? "isEnd" : "isStart"
	return function <Type = any>(input: IReversibleStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`
 */
export function count<Type = any>(pred: IStreamPredicate<Type>) {
	return function (input: IStream<Type>) {
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
	return function <Type = any>(
		input: IReversibleStream<Type>,
		result: IPushable<Type> = new ArrayCollection()
	) {
		while (!input.isEnd) {
			skip(input, delimPred)
			result.push(input.next())
		}
		return result
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
	return function (
		input: IStream<UnderType>,
		result: IPushable<UpperType> = new ArrayCollection()
	) {
		let i = 0
		while (!input.isEnd) result.push(map(input, i++))
		return result
	}
}

/**
 * Returns whether the given `x` is a `Finishable`
 */
export const isFinishable = structCheck<IFinishable>({
	finish: isFunction
}) as <Type = any>(x: any) => x is IFinishable<Type>

/**
 * Returns whether the given `x` is a Navigable
 */
export const isNavigable = structCheck<INavigable>({
	navigate: isFunction
}) as <Type = any>(x: any) => x is INavigable<Type>

/**
 * Returns whether the given `x` is a Rewindable
 */
export const isRewindable = structCheck<IRewindable>({
	rewind: isFunction
}) as <Type = any>(x: any) => x is IRewindable<Type>

export const isStarted = structCheck<IStarted>({
	isStart: isBoolean
})

export const isPrevable = structCheck<IPrevable>({
	prev: isFunction
}) as <Type = any>(x: any) => x is IPrevable<Type>

export const isBackward = and(isStarted, isPrevable) as <Type = any>(
	x: any
) => x is IBackward<Type>

export const isStateful = structCheck<IStateful>({
	state: isObject
})

/**
 * Iterates the given `BasicStream` until hitting the end.
 */
export function uniFinish<Type = any>(stream: IStream<Type>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

/**
 * Calls and returns `stream.finish()`  if `isFinishable(stream)`,
 * else - `uniFinish(stream)`
 */
export function finish<Type = any>(stream: IStream<Type>) {
	return isFinishable<Type>(stream) ? stream.finish() : uniFinish(stream)
}

/**
 * General implementation of the 'navigate' operation for a given `stream`
 * (note: when available, calling `stream.navigate()` is typically faster);
 *
 * Provided with a `Stream` and a `Position`, it:
 *
 * * 1. if the result of the conversion is `number` and it is negative, calls the `stream.prev()` this many times;
 * * 2. if the result of the conversion is `number` and it is positive, calls the `stream.next()` this many times;
 * * 3. if the result of the conversion is `PredicatePosition`, continues to walk the stream until either it is over, or the condition given is met;
 * @returns `stream.curr`
 */
export function uniNavigate<Type = any>(
	stream: IStream<Type>,
	position: IPosition<Type>
): Type {
	if (isNumber(position)) {
		if (position < 0) while (position++) stream.prev!()
		else while (position--) stream.next()
	} else {
		const change = pickDirection(position)
		while (!stream.isEnd && !position(stream))
			change(stream! as IReversibleStream<Type>)
	}

	return stream.curr
}

/**
 * If the given `ReversibleStream` is `Navigable`, calls and returns `stream.navigate(position)`,
 * otherwise - `uniNavigate(stream, position)`.
 */
export function navigate<Type = any>(
	stream: IStream<Type>,
	position: IPosition<Type>
) {
	return isNavigable(stream)
		? stream.navigate(position)
		: uniNavigate(stream, position)
}

/**
 * Performs a universal `rewind`ing operaion on the given `ReversibleStream`.
 * Continues to call '.prev()' on the given `Stream`, until `stream.isStart` is true;
 * @returns `stream.curr`
 */
export function uniRewind<Type = any>(stream: IReversibleStream<Type>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

/**
 * Calls and returns `stream.rewind()` if `isRewindable(stream)`, else - `uniRewind(stream)`
 */
export function rewind<Type = any>(stream: IReversibleStream<Type>): Type {
	return isRewindable<Type>(stream) ? stream.rewind() : uniRewind(stream)
}

/**
 * Returns a function that returns invocation of `f(stream.buffer.get(), stream.pos)`
 */
export function byStreamBufferPos<Type = any, PosType = any>(
	f: (buffer: IIndexed, i: PosType) => any
) {
	return (stream: IStream<Type> & IBufferized<Type> & IPosed<PosType>) =>
		f(stream.buffer.get(), stream.pos)
}

export * as Position from "../Stream/utils/Position.js"

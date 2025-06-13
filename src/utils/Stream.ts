import { type } from "@hgargg-0710/one"
import { ArrayCollection } from "../classes/ArrayCollection.js"
import { HandlerStream } from "../classes/Stream.js"
import type { IClearable, IFiniteWritable, IPushable } from "../interfaces.js"
import type {
	IPrevableStream,
	IRawStream,
	IStream
} from "../interfaces/Stream.js"
import type { IStreamTransform } from "../interfaces/StreamHandler.js"
import { isFinishable, isNavigable, isRewindable } from "../is/Stream.js"
import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"
import {
	direction,
	negate,
	pick
} from "../modules/Stream/utils/StreamPosition.js"

const { isFunction, isNumber } = type

/**
 * Given a `BasicStream`, calls `.next()` on it and returns the result
 */
export function next<T = any>(input: IStream<T>) {
	const curr = input.curr
	input.next()
	return curr
}

/**
 * Given a `ReversibleStream`, calls its `.prev()` and returns the result
 */
export function prev<T = any>(input: IPrevableStream<T>) {
	const curr = input.curr
	input.prev()
	return curr
}

/**
 * Given a `handler` function, returns a function of `input: BasicStream` that
 * skips a single stream-element before and after calling the handler.
 * It then proceeds to returns the result of the handler
 */
export function wrapped<T = any, Out = any>(
	handler: (input: IStream<T>) => Out
) {
	return function (input: IStream<T>) {
		input.next()
		const result = handler(input)
		input.next()
		return result
	}
}

/**
 * Calls `input.next()`, and returns `SkippedItem`.
 *
 * * Note: particularly useful in combination with `StreamParser`,
 * as it allows one to take specific elements of the stream out
 * from the final input
 */
export function destroy<T = any>(
	input: IStream<T>
): typeof HandlerStream.SkippedItem {
	input.next()
	return HandlerStream.SkippedItem
}

/**
 * A polymorphic method for skipping the number of steps inside `input`
 * specified by the `steps` (default - `1`)
 */
export function skip<T = any>(
	input: IPrevableStream<T>,
	steps: IStreamPosition = 1
) {
	return uniNavigate(input, negate(steps))
}

/**
 * Collects contigiously the items of `stream` into `init`, starting from `stream.curr`,
 * consuming the items added in the process
 */
export function consume<T = any>(
	stream: IStream<T>,
	result: IPushable<T> = new ArrayCollection<T>()
) {
	while (!stream.isEnd) result.push(next(stream))
	return result
}

export function write<T = any>(stream: IStream<T>, result: IFiniteWritable<T>) {
	for (let i = 0; i < result.size && !stream.isEnd; ++i)
		result.write(i, next(stream))
	return result
}

export function consumable<T = any>(result: IPushable<T> & IClearable) {
	return function (stream: IStream<T>) {
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
export function has(pos: IStreamPosition) {
	const stopPoint = direction(pos) ? "isEnd" : "isStart"
	return function <Type = any>(input: IPrevableStream<Type>) {
		uniNavigate(input, pos)
		return !input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`
 */
export function count<T = any>(input: IStream<T>) {
	let count = 0
	while (!input.isEnd) ++count
	return count
}

/**
 * Returns a function that collects the items of `input`
 * into `init`, delimiting them by `delimPred`
 */
export function delimited(delimPred: IStreamPosition) {
	return function <T = any>(
		input: IPrevableStream<T>,
		result: IPushable<T> = new ArrayCollection()
	) {
		while (!input.isEnd) {
			skip(input, delimPred)
			result.push(next(input))
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
 * Iterates the given `BasicStream` until hitting the end.
 */
export function uniFinish<T = any>(stream: IStream<T>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

/**
 * Calls and returns `stream.finish()`  if `isFinishable(stream)`,
 * else - `uniFinish(stream)`
 */
export function finish<T = any>(stream: IStream<T>) {
	return isFinishable<T>(stream) ? stream.finish() : uniFinish(stream)
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
export function uniNavigate<T = any>(
	stream: IStream<T>,
	position: IStreamPosition<T>
): T {
	if (isNumber(position)) {
		if (position < 0) while (position++) stream.prev!()
		else while (position--) stream.next()
	} else {
		const change = pick(position)
		while (!stream.isEnd && !position(stream))
			change(stream! as IPrevableStream<T>)
	}

	return stream.curr
}

/**
 * If the given `ReversibleStream` is `Navigable`, calls and returns `stream.navigate(position)`,
 * otherwise - `uniNavigate(stream, position)`.
 */
export function navigate<T = any>(
	stream: IStream<T>,
	position: IStreamPosition<T>
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
export function uniRewind<T = any>(stream: IPrevableStream<T>) {
	while (!stream.isStart) stream.prev()
	return stream.curr
}

/**
 * Calls and returns `stream.rewind()` if `isRewindable(stream)`, else - `uniRewind(stream)`
 */
export function rewind<T = any>(stream: IStream<T>): T {
	return isRewindable<T>(stream)
		? stream.rewind()
		: uniRewind(stream as IPrevableStream<T>)
}

export function rawStreamCopy(rawStream: IRawStream) {
	return isFunction(rawStream) ? rawStream : rawStream.copy()
}

export * as StreamPosition from "../modules/Stream/utils/StreamPosition.js"

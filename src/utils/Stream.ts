import { type } from "@hgargg-0710/one"
import { ArrayCollection } from "../classes/ArrayCollection.js"
import type { Regex } from "../classes/Regex.js"
import { HandlerStream } from "../classes/Stream.js"
import type { IFiniteWritable, IPushable, IRefillable } from "../interfaces.js"
import type {
	IIterableStream,
	IPeekableStream,
	IPrevableStream,
	IRawStream,
	IStream,
	IStreamGenerator
} from "../interfaces/Stream.js"
import type {
	IStreamTransform,
	ITableHandler
} from "../interfaces/StreamHandler.js"
import { isFinishable, isNavigable, isRewindable } from "../is/Stream.js"
import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"
import {
	direction,
	negate,
	pick
} from "../modules/Stream/utils/StreamPosition.js"

const { isFunction, isNumber } = type

/**
 * Given an `IStream<T>`, stores and returns its `.curr`, while calls `.next()` on it.
 */
export function next<T = any>(input: IStream<T>) {
	const curr = input.curr
	input.next()
	return curr
}

/**
 * Given an `IPrevableStream<T>`, stores and returns its `.curr`, while calls `.prev()` on it.
 */
export function prev<T = any>(input: IPrevableStream<T>) {
	const curr = input.curr
	input.prev()
	return curr
}

/**
 * Given a `handler` function, returns a function of `input: IStream<T>` that
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
 * * Note: particularly useful in combination with `HandlerStream`,
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
	steps: IStreamPosition<T> = 1
) {
	return uniNavigate(input, negate(steps))
}

/**
 * Collects the items of `source` into `result`.
 *
 * By default, `result` is an `ArrayCollection<T>`
 */
export function consume<T = any, K extends IPushable<T> = IPushable<T>>(
	source: Iterable<T>,
	result: K = new ArrayCollection<T>() as any
) {
	for (const curr of source) result.push(curr)
	return result
}

/**
 * Writes items from `stream` (in order of appearance) into `result`, until either:
 *
 * 1. one runs out of `result.size` to write to, or
 * 2. the `stream` ends
 *
 * @returns the `result`
 */
export function write<T = any>(stream: IStream<T>, result: IFiniteWritable<T>) {
	for (let i = 0; i < result.size && !stream.isEnd; ++i)
		result.write(i, next(stream))
	return result
}

/**
 * Returns a function that:
 *
 * 1. calls `result.clear()`
 * 2. returns `consume(stream, result)`
 *
 * In other words, it is a way to reuse the exact same
 * `result` for multiple distinct calls to `consume`.
 */
export function consumable<T = any, K extends IRefillable<T> = IRefillable<T>>(
	result: K
) {
	return function (stream: Iterable<T>) {
		result.clear()
		return consume(stream, result)
	}
}

/**
 * Returns a function that returns a function that
 * iterates the `generator(stream, parentMap)`,
 * filling the `result` with its output, and then
 * - returning it.
 */
export function consumeIterable<T = any, Out = any>(
	generator: IStreamGenerator<T>
) {
	return function <K extends IPushable<Out> = IPushable<Out>>(result: K) {
		return function (
			stream: IIterableStream<T>,
			parentMap?: ITableHandler<IIterableStream<T>>
		) {
			for (const x of generator(stream, parentMap)) result.push(x)
			return result
		}
	}
}

/**
 * Navigates up to the desired position on the given `IStream<T>`,
 * returns whether the bound corresponding to the direction of iteration
 * (`.isStart` or `.isEnd` accordingly) has been reached.
 */
export function has<T = any>(pos: IStreamPosition<T>) {
	const stopPoint = direction(pos) ? "isEnd" : "isStart"
	return function (input: IPrevableStream<T>) {
		uniNavigate(input, pos)
		return input[stopPoint]
	}
}

/**
 * Counts the number of items (starting from `stream.curr`),
 * obeying `pred`.
 */
export function count<T = any>(input: IStream<T>) {
	let count = 0
	while (!input.isEnd) {
		++count
		input.next()
	}
	return count
}

/**
 * Returns a function that collects the items of `input`
 * into `result`, delimiting them by `delimPred`.
 *
 * By default, `result` is an `ArrayCollection<T>`
 */
export function delimited<T = any>(delimPred: IStreamPosition<T>) {
	return function <K extends IPushable<T> = IPushable<T>>(
		input: IPrevableStream<T>,
		result: K = new ArrayCollection<T>() as any
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
 * the moment that `input.isEnd`.
 *
 * Note that the function expects `map` to do the calling of the `.next()`
 * method, i.e. the function returned is prone to creating infinite loops.
 */
export function transform<Under = any, Upper = any>(
	map: IStreamTransform<Under, Upper>
) {
	return function <K extends IPushable<Upper> = IPushable<Upper>>(
		input: IStream<Under>,
		result: K = new ArrayCollection() as any
	) {
		let i = 0
		while (!input.isEnd) result.push(map(input, i++))
		return result
	}
}

/**
 * Manually iterates the given `IStream<T>` via `.next()` until hitting the end
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
 * (note: when available, calling `stream.navigate()` is typically much faster);
 *
 * Provided with a `IStream<T>` and an `IStreamPosition<T>`, it:
 *
 * 1. if the result is a `number` and it is negative, calls the `stream.prev()` this many times;
 * 2. if the result is a `number` and it is positive, calls the `stream.next()` this many times;
 * 3. if the result is an `IStreamPositionPredicate`, continues to walk the stream until either
 * it is over, or the condition given is met;
 *
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
 * If the given `IStream<T>` is `INavigable<T>`,
 * calls and returns `stream.navigate(position)`,
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
 * Performs a universal `rewind`ing operaion on
 * the given `IPrevableStream<T>`.
 * Continues to call '.prev()' on the given stream,
 * until `stream.isStart` is true;
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

/**
 * Makes a copy of a `rawStream`:
 *
 * 1. if a chooser - returns as-is (copying operation is meaningless)
 * 2. if an `ILinkedStream` - `rawStream.copy()`
 */
export function rawStreamCopy(rawStream: IRawStream) {
	return isFunction(rawStream) ? rawStream : rawStream.copy()
}

/**
 * This is a curried functional utility-version of `word.match(stream)`
 */
export function match(word: Regex) {
	return function (stream: IPeekableStream) {
		return word.matchAt(stream)
	}
}

/**
 * This is a curried functional version of `input.peek(n)`.
 */
export function peek(n: number) {
	return function <T = any>(input: IPeekableStream<T>) {
		return input.peek(n)
	}
}

export * as StreamPosition from "../modules/Stream/utils/StreamPosition.js"

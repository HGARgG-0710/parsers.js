import { boolean, object, type } from "@hgargg-0710/one"
import type {
	IFiniteWritable,
	ILineIndex,
	IPosed,
	IPushable,
	IRefillable,
	IStateHaving,
	IStateSettable
} from "../interfaces.js"
import type {
	IFinishable,
	IIndexCarrying,
	IIndexStream,
	IIterableStream,
	INavigable,
	IOwnedStream,
	IPeekableStream,
	IRenewerStream,
	IResourcefulStream,
	IStream,
	IStreamGenerator
} from "../interfaces/Stream.js"
import type {
	IStreamTransform,
	ITableHandler
} from "../interfaces/StreamHandler.js"
import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"
import { negate } from "../modules/Stream/utils/StreamPosition.js"
import { ownerDigger, resourceDigger } from "../objects.js"
import { ArrayCollection } from "../objects/ArrayCollection.js"
import type { Regex } from "../objects/Regex.js"
import { HandlerStream } from "../objects/Stream.js"

const { structCheck } = object
const { prop } = object
const { isNumber, isFunction } = type
const { T } = boolean

/**
 * Given an `IStream<T>`, stores and returns its `.curr`, while calls `.next()` on it.
 */
export function next<T = any>(input: IStream<T>) {
	const curr = input.curr
	input.next()
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
	input: IStream<T>,
	steps: IStreamPosition<T> = 1
) {
	return uniNavigate(input, negate(steps))
}

/**
 * Collects the items of `source` into `result`.
 *
 * By default, `result` is an `ArrayCollection<T>`
 */
export function consume<T = any, K extends IPushable<T> = ArrayCollection<T>>(
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
export function consumable<
	T = any,
	I extends Iterable<T> = Iterable<T>,
	K extends IRefillable<T> = IRefillable<T>
>(result: K) {
	return function (stream: I) {
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
export function consumeGenerator<T = any, Out = any>(
	generator: IStreamGenerator<T>
) {
	return function <K extends IPushable<Out> = IPushable<Out>>(result: K) {
		return function (
			stream: IIterableStream<T>,
			parentMap?: ITableHandler<IIterableStream<T>>
		) {
			return consume(generator(stream, parentMap), result)
		}
	}
}

/**
 * Navigates up to the desired position on the given `IStream<T>`,
 * returns whether the end of the stream has been reached.
 */
export function has<T = any>(pos: IStreamPosition<T>) {
	return function (input: IStream<T>) {
		uniNavigate(input, pos)
		return input.isEnd
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
		input: IStream<T>,
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
 * 1. if the result is a `number` and it is positive, calls the `stream.next()` this many times;
 * 2. if the result is an `IPositionPredicate`, continues to walk the stream until either
 * it is over, or the condition given is met;
 *
 * @returns `stream.curr`
 */
export function uniNavigate<T = any>(
	stream: IStream<T>,
	position: IStreamPosition<T>
): T {
	if (isNumber(position)) while (position-- > 0) stream.next()
	else while (!stream.isEnd && !position(stream)) stream.next()
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

/**
 * This is a utility for exhausting all revivable
 * children of a given `stream: IRenewableStream`,
 * and pushing their outputs to `target` (which is
 * then returned), *provided* that the lifetime of
 * `stream.resource` throughout all the revivals
 * is equal to 1, i.e. that `.resource` is always
 * a singleton-stream.
 */
export function consumeSingletonRevivables<
	T extends IPushable = ArrayCollection
>(stream: IRenewerStream, target: T = new ArrayCollection() as any) {
	let couldReviveLast: boolean

	do {
		target.push(next(stream.resource!))
		couldReviveLast = stream.reviveChild()
	} while (couldReviveLast)

	return target
}

/**
 * Given an `IStream` returns its `.curr` property value
 */
export const curr = prop("curr") as <T = any>(x: IStream<T>) => T

/**
 * This linearly searches for an `IIndexStream` among the linked
 * list of `.owner`-s of the given `IOwnedStream`. Upon failure
 * returns `null` - no `IIndexCarrying` could be found.
 */
export function locateIndexCarryingUpwards<
	T extends IOwnedStream = IOwnedStream
>(stream: T): IIndexStream | null {
	return ownerDigger.dig(stream, negate(hasLineIndex)) || null
}

/**
 * This linearly searches for an `IIndexStream` among the linked
 * list of `.resources`-s of the given `IResourcefulStream`. Upon failure
 * returns `null` - no `IIndexCarrying` could be found.
 */
export function locateIndexCarryingDownwards<
	T extends IResourcefulStream = IResourcefulStream
>(stream: T): IIndexStream | null {
	return resourceDigger.dig(stream, negate(hasLineIndex)) || null
}

/**
 * This linearly searches for an `IPosed<number> & IOwnedStream`
 * among the linked list of `.owner`s of the given `IOwnedStream`.
 * Upon failure returns `null` - no `IPosed<number>` could be found.
 */
export function locatePosCarryingUpwards<T extends IOwnedStream = IOwnedStream>(
	stream: T
): (IPosed<number> & IOwnedStream) | null {
	return ownerDigger.dig(stream, negate(hasPos)) || null
}

/**
 * This linearly searches for an `IPosed<number> & IResourcefulStream`
 * among the linked list of `.resource`s of the given `IResourceStream`.
 * Upon failure returns `null` - no `IPosed<number>` could be found.
 */
export function locatePosCarryingDownwards<
	T extends IResourcefulStream = IResourcefulStream
>(stream: T): IResourcefulStream & IPosed<number> {
	return resourceDigger.dig(stream, negate(hasPos)) || null
}

/**
 * Returns whether a given item is an `IPosed<number>`.
 */
export const hasPos = structCheck<IPosed<number>>({ pos: isNumber })

/**
 * This is a predicate verifying (at runtime) bare conformance to the
 * `ILineIndex` interface for the given `x?: any`
 */
export const isLineIndex = structCheck<ILineIndex>({
	char: isNumber,
	line: isNumber,
	nextChar: isFunction,
	nextLine: isFunction
})

/**
 * This is a predicate for verifying that the given `x?: any`
 * is an `IIndexCarrying`.
 */
export const hasLineIndex = structCheck<IIndexCarrying>({
	lineIndex: isLineIndex
})

/**
 * Returns whether the given `x` is a non-`null` object that has a `.finish` property,
 * which is a function.
 */
export const isFinishable = structCheck<IFinishable>({
	finish: isFunction
}) as <T = any>(x: any) => x is IFinishable<T>

/**
 * Returns whether the given `x` is a non-`null` object that has a `.navigate` property,
 * which is a function.
 */
export const isNavigable = structCheck<INavigable>({
	navigate: isFunction
}) as <T = any>(x: any) => x is INavigable<T, any>

/**
 * Returns whether the given input has `.state` and `.setState`
 * properties, the latter of which is a function
 */
export const isStateful = structCheck<IStateHaving & IStateSettable>({
	state: T,
	setState: isFunction
})

export * as StreamPosition from "../modules/Stream/utils/StreamPosition.js"

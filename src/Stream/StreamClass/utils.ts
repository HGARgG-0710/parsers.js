import type { IPosed, IPosition } from "../Position/interfaces.js"
import type { IIndexed } from "../../interfaces.js"
import type { IReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IBasicStream } from "../interfaces.js"

import type {
	IRewindable,
	IFinishable,
	INavigable,
	IStreamClassInstance
} from "./interfaces.js"

import type { IBufferized } from "../../Collection/Buffer/interfaces.js"

import { pickDirection, positionConvert } from "../Position/utils.js"

import { object, type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber } = type

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

/**
 * Iterates the given `BasicStream` until hitting the end.
 */
export function uniFinish<Type = any>(stream: IBasicStream<Type>) {
	while (!stream.isEnd) stream.next()
	return stream.curr
}

/**
 * Calls and returns `stream.finish()`  if `isFinishable(stream)`,
 * else - `uniFinish(stream)`
 */
export function finish<Type = any>(stream: IBasicStream<Type>) {
	return isFinishable<Type>(stream)
		? stream.finish()
		: uniFinish<Type>(stream)
}

/**
 * General implementation of the 'navigate' operation for a given `stream`
 * (note: when available, calling `stream.navigate()` is typically faster);
 *
 * Provided with a `Stream` and a `Position`, it:
 *
 * * 1. converts all the `PositionObject`-s into `DirectionalPosition`-s;
 * * 2. if the result of the conversion is `number` and it is negative, calls the `stream.prev()` this many times;
 * * 3. if the result of the conversion is `number` and it is positive, calls the `stream.next()` this many times;
 * * 4. if the result of the conversion is `PredicatePosition`, continues to walk the stream until either it is over, or the condition given is met;
 * @returns `stream.curr`
 */
export function uniNavigate<Type = any>(
	stream: IReversibleStream<Type> & Partial<IPosed<number>>,
	position: IPosition
): Type {
	if (isNumber((position = positionConvert(position, stream)))) {
		if (position < 0) while (position++) stream.prev()
		else while (position--) stream.next()
	} else {
		const change = pickDirection(position)
		while (!stream.isEnd && !position(stream, stream.pos)) change(stream)
	}

	return stream.curr
}

/**
 * If the given `ReversibleStream` is `Navigable`, calls and returns `stream.navigate(position)`,
 * otherwise - `uniNavigate(stream, position)`.
 */
export function navigate<Type = any>(
	stream: IReversibleStream<Type>,
	position: IPosition
) {
	return isNavigable<Type>(stream)
		? stream.navigate(position)
		: uniNavigate<Type>(stream, position)
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
 * Checks whether the given `StreamClassInstance` is empty
 */
export function isEmpty(stream: IStreamClassInstance) {
	return stream.isEnd && stream.isStart
}

/**
 * Returns a function that returns invocation of `f(stream.buffer.get(), stream.pos)`
 */
export function byStreamBufferPos<Type = any>(
	f: (buffer: IIndexed, i: IPosition) => any
) {
	return (
		stream: IStreamClassInstance<Type> &
			IBufferized<Type> &
			IPosed<IPosition>
	) => f(stream.buffer.get(), stream.pos)
}

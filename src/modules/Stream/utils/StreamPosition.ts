import { functional } from "@hgargg-0710/one"
import type { IPositionStream, IStream } from "../../../interfaces/Stream.js"
import { isPredicatePosition } from "../../../utils/Position.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"

const { negate: _negate } = functional

/**
 * Given an `IStreamPosition<T>`, it returns one of:
 *
 * 1. The original position, If it is a `number`
 * 2. The new `IPredicatePosition<IStream<T>>`
 * `(stream?: IStream<T>, pos?: IStreaamPosition<T>) => !position(stream, pos)`
 */
export function negate<T = any>(
	position: IStreamPosition<T>
): IStreamPosition<T> {
	return isPredicatePosition(position) ? _negate(position) : position
}

/**
 * Given a `IPositionStream<T>`, and a `IStreamPosition<T>`, returns one of:
 *
 * 1. `position(stream)`, if `position` is a `IPredicatePosition`
 * 2. `positionSame(stream.pos, position, stream)` otherwise
 */
export function equals<T = any>(
	stream: IPositionStream<T>,
	position: IStreamPosition<T>
): boolean {
	return isPredicatePosition(position)
		? position(stream)
		: stream.pos === position
}

/**
 * For a `pos: number`, this returns `pos`, and for a `IPredicatePosition`,
 * it returns `preserve(pos, (pos) => pos.bind(target))`.
 */
export function bind<T = any>(
	target: any,
	pos: IStreamPosition<T>
): IStreamPosition<T> {
	return isPredicatePosition<IStream<T>>(pos) ? pos.bind(target) : pos
}

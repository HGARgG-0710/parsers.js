import { functional, type } from "@hgargg-0710/one"
import type { IChange, IPositionStream } from "src/interfaces/Stream.js"
import { isPredicatePosition } from "../../../utils/Position.js"
import { next, prev } from "../../../utils/Stream.js"
import type {
	IStreamPosition,
	IStreamPositionPredicate
} from "../interfaces/StreamPosition.js"

const { isNumber } = type
const { negate: _negate } = functional

/**
 * Given an `IStreamPosition<T>`, it returns one of:
 *
 * 1. The original position, If it is a `number`
 * 2. The result of preserving the original `.direction`
 * on `(x) => !position(x)` if it is a `IPredicatePosition`
 */
export function negate<T = any>(
	position: IStreamPosition<T>
): IStreamPosition<T> {
	return isPredicatePosition(position)
		? preserve(position, _negate)
		: position
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
 * Returns whether given `IStreamPosition<T>` is used to designate backwards iteration.
 * Does so in the next manner:
 *
 * 1. If `pos` is a number: `pos >= 0`
 * 2. If `pos` is a `IPredicatePosition`: `pos.direction`, or, if absent, `true` by default
 */
export function direction<T = any>(pos: IStreamPosition<T>) {
	return isNumber(pos) ? pos >= 0 : !("direction" in pos) || !!pos.direction
}

/**
 * Returns `next`, when `direction(pos) === true` and `prev` otherwise
 */
export function pick<T = any>(pos: IStreamPosition<T>): IChange<T> {
	return direction(pos) ? next : prev
}

/**
 * Applies a given (supposedly,
 * one creating a new `IPredicatePosition`)
 * `transform` onto the given `IPredicatePosition`,
 * whilst preserving the `.direction` on its result
 */
export function preserve<T = any>(
	init: IStreamPositionPredicate<T>,
	transform: (x: IStreamPositionPredicate<T>) => IStreamPositionPredicate<T>
) {
	const transformed = transform(init)
	transformed.direction = direction(init)
	return transformed
}

/**
 * For a `pos: number`, this returns `pos`, and for a `IPredicatePosition`,
 * it returns `preserve(pos, (pos) => pos.bind(target))`.
 */
export function bind<T = any>(target: any, pos: IStreamPosition<T>) {
	return isPredicatePosition(pos)
		? preserve(pos, (pos) => pos.bind(target))
		: pos
}

/**
 * Reverses the `.direction` of the given `predicate`.
 * Note: mutating the original `predicate`
 */
export function reverse<T = any>(predicate: IStreamPositionPredicate<T>) {
	predicate.direction = !direction(predicate)
	return predicate
}

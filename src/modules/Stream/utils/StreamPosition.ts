import { functional, type } from "@hgargg-0710/one"
import type { IChange } from "src/interfaces/Stream.js"
import type { IPosed } from "../../../interfaces/Position.js"
import type { IStream } from "../../../interfaces/Stream.js"
import { isPredicatePosition } from "../../../utils/Position.js"
import { next, prev } from "../../../utils/Stream.js"
import type {
	IStreamPosition,
	IStreamPositionPredicate
} from "../interfaces/StreamPosition.js"

const { isNumber, isUndefined } = type
const { negate: _negate } = functional

/**
 * Given a `DirectionalPosition`, it returns one of:
 *
 * 1. The original position, If it is a `number`
 * 2. The result of preserving the original `.direction` on `(x) => !position(x)` If it is a `PositionPredicate`
 */
export function negate<T = any>(
	position: IStreamPosition<T>
): IStreamPosition<T> {
	return isPredicatePosition(position)
		? preserve(position, _negate)
		: position
}

/**
 * Given a `PositionalStream`, and a `Position`, returns one of:
 *
 * 1. `position(stream)`, if `position` is a `PredicatePosition`
 * 2. `positionSame(stream.pos, position, stream)` otherwise
 */
export function equals<T = any>(
	stream: IStream<T> & IPosed<IStreamPosition<T>>,
	position: IStreamPosition<T>
): boolean {
	return isPredicatePosition(position)
		? position(stream)
		: stream.pos === position
}

/**
 * Compares two granted directional positions in the following fashion:
 *
 * 1. If `direction(pos1) !== direction(pos2)`: return `direction(pos2) > direction(pos1)`;
 * 2. If `direction(pos1) === direction(pos2)` and not both of them are a `number`: return `true`
 * 3. If `direction(pos1) === direction(pos2) && isNumber(pos1) && isNumber(pos2)`: return `pos1 < pos2`
 */
export function compare<T = any>(
	pos1: IStreamPosition<T>,
	pos2: IStreamPosition<T>
) {
	const [fPos1, fPos2] = [pos1, pos2].map(direction)
	if (fPos2 !== fPos1) return fPos2 > fPos1
	return !(isNumber(pos1) && isNumber(pos2)) || pos1 < pos2
}

/**
 * Returns whether given `DirectionalPosition` is a "reverse-position" (that is, used to designate backward iteration).
 * Does so in the next manner:
 *
 * 1. If `pos` is a number: `pos >= 0`
 * 2. If `pos` is a `PredicatePosition`: `pos.direction`, or, if absent, `true` by default
 */
export function direction<T = any>(pos: IStreamPosition<T>) {
	return isNumber(pos) ? pos >= 0 : !("direction" in pos) || pos.direction!
}

/**
 * Returns `next`, when `direction(pos)` and `previous` otherwise
 */
export function pick<T = any>(pos: IStreamPosition<T>): IChange<T> {
	return direction(pos) ? next : prev
}

/**
 * Applies a given (supposedly, copying) transform onto the given `PredicatePosition`, whilst preserving the `.direction`
 */
export function preserve<T = any>(
	init: IStreamPositionPredicate<T>,
	transform: (x: IStreamPositionPredicate<T>) => IStreamPositionPredicate<T>
) {
	const transformed = transform(init)
	const direction = init.direction
	if (!isUndefined(direction)) transformed.direction = direction
	return transformed
}

export function bind<T = any>(target: any, pos: IStreamPosition<T>) {
	return isPredicatePosition(pos)
		? preserve(pos, (pos) => pos.bind(target))
		: pos
}

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export function backtrack<T = any>(predicate: IStreamPositionPredicate<T>) {
	predicate.direction = false
	return predicate
}

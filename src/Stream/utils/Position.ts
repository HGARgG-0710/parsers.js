import { functional, type } from "@hgargg-0710/one"
import type { IPosition, IStream } from "../../interfaces/Stream.js"
import { next, previous } from "../../utils/Stream.js"
import type {
	IChange,
	IPosed,
	IPredicatePosition
} from "../interfaces/Position.js"

const { isFunction, isNumber, isUndefined } = type
const { or, negate } = functional

/**
 * Returns whether given `x` is a `PredicatePosition`
 */
export const isPredicatePosition = isFunction as <Type = any>(
	x: any
) => x is IPredicatePosition<Type>

/**
 * Returns whether given `x` is a `Position`
 */
export const isPosition = or(isNumber, isPredicatePosition) as <Type = any>(
	x: any
) => x is IPosition<Type>

/**
 * Given a `DirectionalPosition`, it returns one of:
 *
 * 1. The original position, If it is a `number`
 * 2. The result of preserving the original `.direction` on `(x) => !position(x)` If it is a `PositionPredicate`
 */
export function positionNegate<Type = any>(
	position: IPosition<Type>
): IPosition<Type> {
	return isPredicatePosition(position)
		? preserveDirection(position, negate)
		: position
}

/**
 * Given a `PositionalStream`, and a `Position`, returns one of:
 *
 * 1. `position(stream)`, if `position` is a `PredicatePosition`
 * 2. `positionSame(stream.pos, position, stream)` otherwise
 */
export function positionEqual<Type = any>(
	stream: IStream<Type> & IPosed<IPosition<Type>>,
	position: IPosition<Type>
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
export function directionCompare<Type = any>(
	pos1: IPosition<Type>,
	pos2: IPosition<Type>
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
export function direction<Type = any>(pos: IPosition<Type>) {
	return isNumber(pos) ? pos >= 0 : !("direction" in pos) || pos.direction!
}

/**
 * Returns `next`, when `direction(pos)` and `previous` otherwise
 */
export const pickDirection = <Type = any>(
	pos: IPosition<Type>
): IChange<Type> => (direction(pos) ? next : previous)

/**
 * Applies a given (supposedly, copying) transform onto the given `PredicatePosition`, whilst preserving the `.direction`
 */
export function preserveDirection<Type = any>(
	init: IPredicatePosition<Type>,
	transform: (x: IPredicatePosition<Type>) => IPredicatePosition<Type>
) {
	const transformed = transform(init)
	const direction = init.direction
	if (!isUndefined(direction)) transformed.direction = direction
	return transformed
}

export function positionBind<Type = any, T extends IPosition<Type> = any>(
	target: any,
	pos: T
) {
	return isPredicatePosition(pos)
		? preserveDirection(pos, (pos) => pos.bind(target))
		: pos
}

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export function positionBacktrack<Type = any>(
	predicate: IPredicatePosition<Type>
) {
	predicate.direction = false
	return predicate
}

import type { BasicStream } from "../Stream/interfaces.js"
import type {
	DirectionalPosition,
	Position,
	PositionObject,
	PredicatePosition,
	Posed,
	Change
} from "./interfaces.js"

import { previous, next } from "src/Stream/utils.js"

import { object, type, boolean, functional } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber, isUndefined } = type
const { or, negate } = functional
const { T } = boolean

export const isPredicatePosition = isFunction as <Type = any>(
	x: any
) => x is PredicatePosition<Type>

export const isPositionObject = structCheck({
	convert: isFunction,
	value: T
}) as <Type = any>(x: any) => x is PositionObject<Type>

export const isPosition = or(isNumber, isPredicatePosition, isPositionObject) as <
	Type = any
>(
	x: any
) => x is Position<Type>

/**
 * Given a `Position` and (optionally) a `BasicStream`, it returns one of:
 *
 * * The original position, If it is a `DirectionalPosition`
 * * The result of `pos.convert(stream)`, if it's a 'PositionObject'
 */
export function positionConvert<Type = any>(
	pos: Position<Type>,
	stream?: BasicStream<Type>
): DirectionalPosition<Type> {
	return isPositionObject(pos) ? pos.convert(stream!) : pos
}

/**
 * Given a `DirectionalPosition`, it returns one of:
 *
 * * The original position, If it is a `number`
 * * The result of preserving the original `.direction` on `(x) => !position(x)` If it is a `PositionPredicate`
 */
export function positionNegate<Type = any>(position: Position<Type>): Position<Type> {
	return isPredicatePosition(position) ? preserveDirection(position, negate) : position
}

/**
 * Returns a `boolean`, indicating whether the results of `(x) => positionConvert(x, stream)` for `pos1` and `pos2` are equal
 */
export function positionSame<Type = any>(
	pos1: Position<Type>,
	pos2: Position<Type>,
	stream?: BasicStream<Type>
) {
	if (isPositionObject(pos1) && isPredicatePosition(pos1.equals))
		return pos1.equals(pos2)
	return positionConvert(pos1, stream) === positionConvert(pos2, stream)
}

/**
 * Given a `PositionalStream`, and a `Position`, returns one of:
 *
 * * The `position(stream)`, if `position` is a `PredicatePosition`
 * * The `positionSame(stream.pos, position, stream)` otherwise
 */
export function positionEqual<Type = any>(
	stream: BasicStream<Type> & Posed<Position<Type>>,
	position: Position<Type>
): boolean {
	return isPredicatePosition(position)
		? position(stream)
		: positionSame(stream.pos, position, stream)
}

/**
 * Compares two granted positions directionally relative to an (optional) `Stream` in the following fashion:
 *
 * * 0. Convert the given positions to `DirectionalPosition`
 * * 1. If `isBackward(pos1) !== isBackward(pos2)`: return `isBackward(pos2) < isBackward(pos1)`;
 * * 2. If `isBackward(pos1) === isBackward(pos2)` and not both of them are a `number`: return `true`
 * * 3. If `isBackward(pos1) === isBackward(pos2) && isNumber(pos1) && isNumber(pos2)`: return `pos1 < pos2`
 */
export function directionCompare<Type = any>(
	pos1: Position<Type>,
	pos2: Position<Type>,
	stream?: BasicStream<Type>
) {
	const converted = [pos1, pos2].map((pos) => positionConvert(pos, stream))
	const [cPos1, cPos2] = converted
	const [bPos1, bPos2] = [pos1, pos2].map((_, i) => isBackward(converted[i]))
	if (bPos2 !== bPos1) return bPos2 < bPos1
	return !(isNumber(cPos1) && isNumber(cPos2)) || cPos1 < cPos2
}

/**
 * Returns whether given `DirectionalPosition` is a "reverse-position" (that is, used to designate backward iteration).
 * Does so in the next manner:
 *
 * * 1. If `pos` is a number: `pos < 0`
 * * 2. If `pos` is a `PredicatePosition`: `pos.direction`, or, if absent, `true` by default
 */
export function isBackward<Type = any>(pos: DirectionalPosition<Type>): boolean {
	return isNumber(pos) ? pos < 0 : !("direction" in pos) || (pos.direction as boolean)
}

/**
 * Returns one of `previous` or `next` based on whether `isBackward(pos)` is true or not
 */
export function pickDirection<Type = any>(pos: DirectionalPosition<Type>): Change {
	return isBackward(pos) ? previous : next
}

/**
 * Applies a given (supposedly, copying) transform onto the given `PredicatePosition`, whilst preserving the `.direction`
 */
export function preserveDirection<Type = any>(
	init: PredicatePosition<Type>,
	transform: (x: PredicatePosition<Type>) => PredicatePosition<Type>
) {
	const transformed = transform(init)
	const direction = init.direction
	if (!isUndefined(direction)) transformed.direction = direction
	return transformed
}

import type { IBasicStream } from "../Stream/interfaces.js"
import type {
	IDirectionalPosition,
	IPosition,
	IPositionObject,
	IPredicatePosition,
	IPosed,
	IChange
} from "./interfaces.js"

import { previous, next } from "../Stream/utils.js"

import { object, type, functional } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber, isUndefined } = type
const { or, negate } = functional

/**
 * Returns whether given `x` is a `PredicatePosition`
 */
export const isPredicatePosition = isFunction as <Type = any>(
	x: any
) => x is IPredicatePosition<Type>

/**
 * Returns whether given `x` is a `PredicatePosition`
 */
export const isPositionObject = structCheck({
	convert: isFunction
}) as <Type = any>(x: any) => x is IPositionObject<Type>

/**
 * Returns whether given `x` is a `Position`
 */
export const isPosition = or(
	isNumber,
	isPredicatePosition,
	isPositionObject
) as <Type = any>(x: any) => x is IPosition<Type>

/**
 * Given a `Position` and (optionally) a `BasicStream`, it returns one of:
 *
 * 1. The original position, If it is a `DirectionalPosition`
 * 2. The result of `pos.convert(stream)`, if it's a `PositionObject`
 */
export function positionConvert<Type = any>(
	pos: IPosition<Type>,
	stream?: IBasicStream<Type>
): IDirectionalPosition<Type> {
	return isPositionObject(pos) ? pos.convert(stream) : pos
}

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
 * Returns a `boolean`, indicating whether the results of `(x) => positionConvert(x, stream)` for `pos1` and `pos2` are equal
 */
export function positionSame<Type = any>(
	pos1: IPosition<Type>,
	pos2: IPosition<Type>,
	stream?: IBasicStream<Type>
) {
	if (isPositionObject(pos1) && isFunction(pos1.equals))
		return pos1.equals(pos2)
	return positionConvert(pos1, stream) === positionConvert(pos2, stream)
}

/**
 * Given a `PositionalStream`, and a `Position`, returns one of:
 *
 * 1. `position(stream)`, if `position` is a `PredicatePosition`
 * 2. `positionSame(stream.pos, position, stream)` otherwise
 */
export function positionEqual<Type = any>(
	stream: IBasicStream<Type> & IPosed<IPosition<Type>>,
	position: IPosition<Type>
): boolean {
	return isPredicatePosition(position)
		? position(stream)
		: positionSame(stream.pos, position, stream)
}

/**
 * Compares two granted positions directionally relative to an (optional) `Stream` in the following fashion:
 *
 * 0. Convert the given positions to `DirectionalPosition`
 * 1. If `direction(pos1) !== direction(pos2)`: return `direction(pos2) > direction(pos1)`;
 * 2. If `direction(pos1) === direction(pos2)` and not both of them are a `number`: return `true`
 * 3. If `direction(pos1) === direction(pos2) && isNumber(pos1) && isNumber(pos2)`: return `pos1 < pos2`
 */
export function directionCompare<Type = any>(
	pos1: IPosition<Type>,
	pos2: IPosition<Type>,
	stream?: IBasicStream<Type>
) {
	const converted = [pos1, pos2].map((pos) => positionConvert(pos, stream))
	const [cPos1, cPos2] = converted
	const [fPos1, fPos2] = [pos1, pos2].map((_, i) => direction(converted[i]))
	if (fPos2 !== fPos1) return fPos2 > fPos1
	return !(isNumber(cPos1) && isNumber(cPos2)) || cPos1 < cPos2
}

/**
 * Returns whether given `DirectionalPosition` is a "reverse-position" (that is, used to designate backward iteration).
 * Does so in the next manner:
 *
 * 1. If `pos` is a number: `pos >= 0`
 * 2. If `pos` is a `PredicatePosition`: `pos.direction`, or, if absent, `true` by default
 */
export function direction<Type = any>(pos: IDirectionalPosition<Type>) {
	return isNumber(pos) ? pos >= 0 : !("direction" in pos) || pos.direction!
}

/**
 * Returns `next`, when `direction(pos)` and `previous` otherwise
 */
export function pickDirection<Type = any>(
	pos: IDirectionalPosition<Type>
): IChange {
	return direction(pos) ? next : previous
}

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

/**
 * Adds a `.direction = false` property on a given `PredicatePosition`
 */
export function positionBacktrack<Type = any>(
	predicate: IPredicatePosition<Type>
) {
	predicate.direction = false
	return predicate
}

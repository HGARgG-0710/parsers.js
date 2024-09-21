import { object, typeof as type, boolean, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber, isArray } = type
const { trivialCompose, or } = f
const { not } = boolean

import type {
	DirectionalPosition,
	DualPosition,
	Position,
	PositionObject,
	PredicatePosition
} from "./interfaces.js"

import type { PositionalStream } from "../interfaces.js"

import { previous, next } from "src/utils.js"
import type { ChangeType } from "src/Stream/ReversibleStream/interfaces.js"
import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { BoundNameType } from "src/Stream/StreamClass/interfaces.js"

export const isPositionObject = structCheck<PositionObject>({ convert: isFunction })

export const isPosition = or(isNumber, isFunction, isPositionObject) as <Type = any>(
	x: any
) => x is Position<Type>

export function isDualPosition<Type = any>(x: any): x is DualPosition<Type> {
	return isArray(x) && isPosition<Type>(x[0]) && (!(1 in x) || isPosition<Type>(x[1]))
}

/**
 * Given a `Position` and (optionally) a `BasicStream`, it returns one of:
 *
 * * The original position, If it is a `DirectionalPosition`
 * * The result of `pos.convert(stream)`, if it's a 'PositionObject'
 */
export function positionConvert(
	pos: Position,
	stream?: BasicStream
): DirectionalPosition {
	return isPositionObject(pos) ? pos.convert(stream) : pos
}

/**
 * Given a `DirectionalPosition`, it returns one of:
 *
 * * The original position, If it is a `number`
 * * The result of preserving the original `.direction` on `(x) => !position(x)` If it is a `PositionPredicate`
 */
export function positionNegate(position: DirectionalPosition): DirectionalPosition {
	return isFunction(position)
		? preserveDirection(position, (position) => trivialCompose(not, position))
		: position
}

/**
 * Returns a `boolean`, indicating whether the results of `(x) => positionConvert(x, stream)` for `pos1` and `pos2` are equal
 */
export function positionSame(pos1: Position, pos2: Position, stream?: BasicStream) {
	if (isPositionObject(pos1) && isFunction(pos1.equals)) return pos1.equals(pos2)
	return positionConvert(pos1, stream) === positionConvert(pos2, stream)
}

/**
 * Given a `PositionalStream`, and a `Position`, returns one of:
 *
 * * The `position(stream)`, if `position` is a `PredicatePosition`
 * * The `positionSame(stream.pos, position, stream)` otherwise
 */
export function positionEqual(stream: PositionalStream, position: Position): boolean {
	return isFunction(position)
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
export function directionCompare(pos1: Position, pos2: Position, stream?: BasicStream) {
	const converted = [pos1, pos2].map((pos) => positionConvert(pos, stream))
	const [cPos1, cPos2] = converted
	const [bPos1, bPos2] = [pos1, pos2].map((_, i) => isBackward(converted[i]))
	if (bPos2 !== bPos1) return bPos2 < bPos1
	return !(isNumber(cPos1) && isNumber(cPos2)) || cPos1 < cPos2
}

/**
 * Given a `Position`, copies it via one of:
 *
 * * 1. If `x` is a `PositionObject`, and has `.copy` on itself: `x.copy()`
 * * 2. If `x` is a `PositionObject` without `.copy`: `{...x}`
 * * 3. If `x` is not a `PositionObject`: `x`
 *
 * NOTE: does not copy `PredicatePosition`s [those have to be manually bound/re-created];
 */
export function positionCopy(x: Position): Position {
	return isPositionObject(x) ? (isFunction(x.copy) ? x.copy() : { ...x }) : x
}

/**
 * Creates a `PredicatePosition` based off given `DirectionalPosition`.
 * Does so in the following fashion:
 *
 * * 1. If `x` is a `PredicatePosition`: `x`
 * * 2. If `x` is a number: `((_, i = 0, j = 0) => i + j < Math.abs(x))`, with `.direction` being `x >= 0`
 */
export function predicateChoice(x: DirectionalPosition): PredicatePosition {
	if (!isNumber(x)) return x

	const abs = Math.abs(x)
	const result: PredicatePosition = (
		_input: BasicStream,
		i: number = 0,
		j: number = 0
	) => i + j < abs
	result.direction = x >= 0
	return result
}

/**
 * Returns whether given `DirectionalPosition` is a "reverse-position" (that is, used to designate backward iteration).
 * Does so in the next manner:
 *
 * * 1. If `pos` is a number: `pos < 0`
 * * 2. If `pos` is a `PredicatePosition`: `pos.direction`, or, if absent, `true` by default
 */
export function isBackward(pos: DirectionalPosition): boolean {
	return isNumber(pos) ? pos < 0 : !("direction" in pos) || (pos.direction as boolean)
}

/**
 * Returns one of `previous` or `next` based on whether `isBackward(pos)` is true or not
 */
export function pickDirection(pos: DirectionalPosition): ChangeType {
	return isBackward(pos) ? previous : next
}

/**
 * Given a `PredicatePosition`, returns a `positionStopPoint`-safe `StreamPredicate`
 * 		[never overflows a given `Stream`]
 */
export function endPredicate(predicate: PredicatePosition): StreamPredicate {
	const stopPoint = positionStopPoint(predicate)
	return (input: BasicStream, i: number = 0) => !input[stopPoint] && predicate(input, i)
}

/**
 * Given a `Position`, returns a pair of `[pickDirection(positionConvert(directional, stream)), endPredicate(predicateChoice(positionConverte(directional, stream)))]`
 */
export function iterationChoice(
	position: Position,
	stream?: BasicStream
): [ChangeType, StreamPredicate] {
	const converted = positionConvert(position, stream)
	return [pickDirection(converted), endPredicate(predicateChoice(converted))]
}

/**
 * Applies a given (supposedly, copying) transform onto the given `PredicatePosition`, whilst preserving the `.direction`
 */
export function preserveDirection(
	init: PredicatePosition,
	transform: (x: PredicatePosition) => PredicatePosition
) {
	const transformed = transform(init)
	if ("direction" in init) transformed.direction = init.direction
	return transformed
}

/**
 * Returns the name of the `bounding` property of `Stream`s based off a given `Position`
 *
 * * 1. `"isStart"` if `isBackward(pos)`
 * * 2. `"isEnd"` otherwise
 */
export function positionStopPoint(pos: DirectionalPosition): BoundNameType {
	return isBackward(pos) ? "isStart" : "isEnd"
}

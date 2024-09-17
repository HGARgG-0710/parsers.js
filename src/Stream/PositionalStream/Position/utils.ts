import { object, typeof as type, boolean, function as f } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber, isArray } = type
const { trivialCompose } = f
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
import { isPositional } from "../utils.js"

export const isPositionObject = structCheck<PositionObject>({ convert: isFunction })

export function isPosition<Type = any>(x: any): x is Position<Type> {
	return isNumber(x) || isFunction(x) || isPositionObject(x)
}

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
 * Given two `Position`s and (optionally) a `BasicStream`, returns the result of calling `positionCompare` on `(x) => positionConvert(x, stream)` for `pos1` and `pos2`
 */
export function simplifiedPositionCompare(
	pos1: Position,
	pos2: Position,
	stream?: BasicStream
) {
	return positionCompare(
		positionConvert(pos1, stream),
		positionConvert(pos2, stream),
		stream
	)
}

/**
 * Used for comparison of positions (possibly, within a given `Stream`).
 * Given two `Position`s and (optionally) a `Stream`, it does so in the following fashion:
 *
 * * 1. If both `pos1` and `pos2` are numbers: `pos1 < pos2`
 * * 2. If `pos1` is a `PositionalObject` with '.compare' defined on it: `pos1.compare(pos2, stream)`
 * * 3. If `stream` is given, is a `PositionalStream`, `pos1 === stream.pos` and `pos2` is not a `PredicatePosition`: `!stream.pos(pos2)`
 * * 4. If `stream` is given, is a `PositionalStream`, `pos2 === stream.pos` and `pos1` is not a `PredicatePosition`: `stream.pos(pos1)`
 * * 5. If `pos1` is a `PredicatePosition` and `pos2` is a `PredicatePosition`: `pos1(stream) && !pos2(stream)`
 * * 6. If `pos1` is a `PredicatePosition` and `pos2` is falsy/absent, or `stream` is not a `PositionalStream`: `pos1(stream)`
 * * 7. If `pos1` is a `PredicatePosition` and `pos2` is neither falsy nor a `PredicatePosition`, and `stream` is given and is a `PositionalStream`:
 * 		`pos1(stream) && positionCompare(stream.pos, pos2, stream)`
 * * 8. If none of 1.-7. held, `pos2` is a `PredicatePosition` and `stream` is not a `PositionalStream`: `!pos2(stream)`
 * * 9. If none of 1.-7. held, `pos2` is a `PredicatePosition`, and `stream` is a `PositionalStream`: `!pos2(stream) && positionCompare(pos1, stream.pos, stream)`
 * * 10. If none of 1.-9. held: `simplifiedPositionCompare(pos1, pos2, stream)`
 */
export function positionCompare(
	pos1: Position,
	pos2: Position,
	stream?: BasicStream
): boolean {
	if (isNumber(pos1) && isNumber(pos2)) return pos1 < pos2
	if (isPositionObject(pos1) && isFunction(pos1.compare))
		return pos1.compare(pos2, stream)

	const isPos1Function = isFunction(pos1)
	const isPos2Function = isFunction(pos2)
	const isStreamPositional = isPositional(stream)

	if (isStreamPositional && isFunction(stream.pos)) {
		if (pos1 === stream.pos && !isPos2Function) return !stream.pos(pos2)
		if (pos2 === stream.pos && !isPos1Function) return stream.pos(pos1)
	}

	if (isPos1Function)
		return (
			pos1(stream) &&
			(isPos2Function
				? !pos2(stream)
				: !(pos2 && isStreamPositional) ||
				  positionCompare(stream.pos, pos2, stream))
		)

	if (isPos2Function)
		return (
			!pos2(stream) &&
			(!isStreamPositional || positionCompare(pos1, stream.pos, stream))
		)

	return simplifiedPositionCompare(pos1, pos2, stream)
}

/**
 * Given a `PositionalStream` and a `Position`, returns `positionCompare(stream.pos, position, stream)`
 */
export function positionCheck(stream: PositionalStream, position: Position) {
	return positionCompare(stream.pos, position, stream)
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
 * Given a `DirectionalPosition`, returns a pair of `[pickDirection(directional), endPredicate(predicateChoice(directional))]`
 */
export function iterationChoice(
	directional: DirectionalPosition
): [ChangeType, StreamPredicate] {
	return [pickDirection(directional), endPredicate(predicateChoice(directional))]
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

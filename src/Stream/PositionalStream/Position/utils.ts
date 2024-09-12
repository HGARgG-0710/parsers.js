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

import { previous, next } from "src/aliases.js"
import type { ChangeType } from "src/Stream/ReversibleStream/interfaces.js"
import type { DelimPredicate } from "src/Parser/ParserMap/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { BoundNameType } from "src/Stream/StreamClass/interfaces.js"
import { isPositional } from "../utils.js"

export function isDualPosition<Type = any>(x: any): x is DualPosition<Type> {
	return isArray(x) && isPosition<Type>(x[0]) && (!(1 in x) || isPosition<Type>(x[1]))
}

export function positionConvert(
	pos: Position,
	stream?: BasicStream
): DirectionalPosition {
	return isPositionObject(pos) ? pos.convert(stream) : pos
}

export function positionNegate(position: DirectionalPosition): DirectionalPosition {
	return isFunction(position)
		? preserveDirection(position, (position) => trivialCompose(not, position))
		: position
}

export function isPosition<Type = any>(x: any): x is Position<Type> {
	return isNumber(x) || isFunction(x) || isPositionObject(x)
}

export const isPositionObject = structCheck<PositionObject>({ convert: isFunction })

export function positionSame(pos1: Position, pos2: Position, stream?: BasicStream) {
	return positionConvert(pos1, stream) === positionConvert(pos2, stream)
}

export function positionEqual(stream: PositionalStream, position: Position) {
	return isFunction(position)
		? position(stream)
		: positionSame(stream.pos, position, stream)
}

export function simplifiedPositionCompare(
	pos1: Position,
	pos2: Position,
	stream?: BasicStream
): boolean {
	return positionCompare(
		positionConvert(pos1, stream),
		positionConvert(pos2, stream),
		stream
	)
}

export function positionCompare(pos1: Position, pos2: Position, stream?: BasicStream) {
	if (isNumber(pos1) && isNumber(pos2)) return pos1 < pos2
	if (isPositionObject(pos1) && pos1.compare) return pos1.compare(pos2, stream)

	const isPos1Function = isFunction(pos1)
	const isPos2Function = isFunction(pos2)
	const isStreamPositional = isPositional(stream)

	if (isStreamPositional && isFunction(stream.pos)) {
		if (pos1 === stream.pos && !isPos2Function) return stream.pos(pos2)
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

export function positionCheck(stream: PositionalStream, position: Position) {
	return positionCompare(stream.pos, position, stream)
}

export function positionCopy(x: Position): Position {
	return isPositionObject(x) ? (x.copy ? x.copy() : { ...x }) : x
}

export function predicateChoice(x: DirectionalPosition): PredicatePosition {
	if (isNumber(x)) {
		const abs = Math.abs(x)
		const result: PredicatePosition = (
			_input: BasicStream,
			i: number = 0,
			j: number = 0
		) => i + j < abs
		result.direction = x >= 0
		return result
	}
	return x
}

export function isBackward(pos: DirectionalPosition): boolean {
	return isNumber(pos) ? pos < 0 : !("direction" in pos) || (pos.direction as boolean)
}

export function pickDirection(pos: DirectionalPosition): ChangeType {
	return isBackward(pos) ? previous : next
}

export function endPredicate(predicate: PredicatePosition): DelimPredicate {
	const stopPoint = positionStopPoint(predicate)
	return (input: BasicStream, i: number = 0, j: number = 0) =>
		!input[stopPoint] && predicate(input, i, j)
}

export function iterationChoice(
	directional: DirectionalPosition
): [ChangeType, DelimPredicate] {
	return [pickDirection(directional), endPredicate(predicateChoice(directional))]
}

export function preserveDirection(
	init: PredicatePosition,
	transform: (x: PredicatePosition) => PredicatePosition
) {
	const transformed = transform(init)
	transformed.direction = init.direction
	return transformed
}

export function positionStopPoint(pos: DirectionalPosition): BoundNameType {
	return isBackward(pos) ? "isStart" : "isEnd"
}

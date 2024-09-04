import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber, isArray } = type

import type {
	DirectionalPosition,
	BasicPosition,
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
import type { BoundNameType } from "src/Stream/IterationHandler/interfaces.js"

export function positionExtract(pos: DirectionalPosition): BasicPosition {
	return isFunction(pos) ? pos : Math.abs(pos)
}

export function isDualPosition<Type = any>(x: any): x is DualPosition<Type> {
	return isArray(x) && isPosition<Type>(x[0]) && (!(1 in x) || isPosition<Type>(x[1]))
}

export function positionConvert(
	pos: Position,
	stream?: BasicStream
): DirectionalPosition {
	return isPositionObject(pos) ? pos.convert(stream) : pos
}

export function isPosition<Type = any>(x: any): x is Position<Type> {
	return isNumber(x) || isFunction(x) || isPositionObject(x)
}

export const isPositionObject = structCheck<PositionObject>({ convert: isFunction })

export function positionCheck(stream: PositionalStream, position: Position) {
	if (isPositionObject(position) && position.compare && isPositionObject(stream.pos))
		return position.compare(stream.pos)

	const checked = positionExtract(positionConvert(position, stream))
	const streampos = positionExtract(positionConvert(stream.pos, stream))
	return isNumber(checked)
		? isNumber(streampos)
			? checked < streampos
			: streampos(checked)
		: checked(streampos)
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

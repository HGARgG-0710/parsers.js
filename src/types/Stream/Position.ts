import type { SummatFunction } from "@hgargg-0710/summat.ts"
import { object, typeof as type } from "@hgargg-0710/one"
const { structCheck } = object
const { isFunction, isNumber } = type

import type { PositionalStream } from "./PositionalStream.js"
import type { BasicStream } from "./BasicStream.js"
import type { Pattern } from "../Pattern.js"

export interface PositionObject<Type = any> extends Pattern<Type> {
	convert(stream?: BasicStream): number | PredicatePosition
	compare?(position: PositionObject<Type>): boolean
	copy?(): PositionObject<Type>
}

export interface PredicatePosition extends SummatFunction {
	direction?: boolean
}

export type Position<Type = any> = PredicatePosition | PositionObject<Type> | number
export type DirectionalPosition = PredicatePosition | number
export type BasicPosition = SummatFunction | number

const convertCheck = structCheck<PositionObject>("convert")
export function isPositionObject(x: any): x is PositionObject {
	return convertCheck(x) && isFunction(x.convert)
}

export function positionExtract(pos: DirectionalPosition): BasicPosition {
	return isFunction(pos) ? pos : Math.abs(pos)
}

export function positionConvert(
	pos: Position,
	stream?: BasicStream
): DirectionalPosition {
	return isPositionObject(pos) ? pos.convert(stream) : pos
}

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

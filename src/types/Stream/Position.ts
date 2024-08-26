import type { Summat, SummatFunction } from "../Summat.js"
import { isFunction, isNumber } from "src/misc.js"
import type { PositionalStream } from "./PositionalStream.js"
import type { BasicStream } from "./BasicStream.js"

import { object } from "@hgargg-0710/one"
const { structCheck } = object

export type PositionObject<Type = any> = Summat & {
	value: Type
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

const convertCheck = structCheck("convert")
export function isPositionObject(x: any): x is PositionObject {
	return convertCheck(x) && isFunction(x.convert)
}

export function positionExtract(pos: DirectionalPosition): BasicPosition {
	return isFunction(pos) ? pos : Math.abs(pos)
}

// ? Should calls of this be made OUTSIDE the closures in the 'utils', or INSIDE them? [With an additional 'stream' argument?];
export function positionConvert(pos: Position): DirectionalPosition {
	return isPositionObject(pos) ? pos.convert() : pos
}

export function positionCheck(stream: PositionalStream, position: Position) {
	if (isPositionObject(position) && position.compare && isPositionObject(stream.pos))
		return position.compare(stream.pos)
	const checked = positionExtract(positionConvert(position))
	const streampos = positionExtract(positionConvert(stream.pos))
	return isNumber(checked)
		? isNumber(streampos)
			? checked < streampos
			: streampos(checked)
		: checked(streampos)
}

export function positionCopy(x: Position): Position {
	return isPositionObject(x) ? (x.copy ? x.copy() : { ...x }) : x
}

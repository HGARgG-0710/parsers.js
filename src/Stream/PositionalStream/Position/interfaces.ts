import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern } from "src/Pattern/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"

export type Position<Type = any> = PredicatePosition | StaticPosition<Type>
export type DirectionalPosition = PredicatePosition | number
export type BasicPosition = SummatFunction | number

export type DualPosition<Type = any> = [Position<Type>, Position<Type>?]

export type StaticPosition<Type = any> = PositionObject<Type> | number
export interface PredicatePosition extends SummatFunction {
	direction?: boolean
}

export interface PositionObject<Type = any> extends Pattern<Type> {
	convert(stream?: BasicStream): number | PredicatePosition
	compare?(position: PositionObject<Type>): boolean
	copy?(): PositionObject<Type>
}

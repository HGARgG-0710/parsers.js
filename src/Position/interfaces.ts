import type { Summat, SummatFunction } from "@hgargg-0710/summat.ts"
import type { Pattern } from "../Pattern/interfaces.js"
import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"

export type Position<Type = any> = PredicatePosition | PositionObject<Type> | number
export type DirectionalPosition = PredicatePosition | number
export type BasicPosition = SummatFunction | number

export interface PredicatePosition extends SummatFunction {
	direction?: boolean
}

export interface PositionObject<Type = any> extends Pattern<Type> {
	convert: (stream?: BasicStream) => number | PredicatePosition
	equals?: (position: Position) => boolean
	compare?: (position: Position, stream?: BasicStream) => boolean
	copy?: () => PositionObject<Type>
}

export interface Posed<Type = any> extends Summat {
	pos: Type
}

export type ChangeType<Type = any> = (input: ReversibleStream<Type>) => Type

export type * from "./MultiIndex/interfaces.js"

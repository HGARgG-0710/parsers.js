import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream } from "../Stream/interfaces.js"

export type Position = PredicatePosition | PositionObject | number
export type DirectionalPosition = PredicatePosition | number
export type BasicPosition = SummatFunction | number

export interface PredicatePosition extends Function {
	direction?: boolean
}

export interface PositionObject {
	convert: (stream: BasicStream) => DirectionalPosition
	equals?: (position: Position) => boolean
	compare?: (position: Position, stream?: BasicStream) => boolean
	copy?: () => PositionObject
}

export interface Posed<Type = any> {
	pos: Type
}

export interface OptPosed<Type = any> {
	pos?: Type
}

export type ChangeType<Type = any> = (input: ReversibleStream<Type>) => Type

export type * from "./MultiIndex/interfaces.js"

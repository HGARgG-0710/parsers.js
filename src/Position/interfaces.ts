import type { ReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { BasicStream, DirectionHaving } from "../Stream/interfaces.js"

export type Position<Type = any> = DirectionalPosition<Type> | PositionObject<Type>
export type DirectionalPosition<Type = any> = PredicatePosition<Type> | number
export type PredicatePosition<Type = any> = ((
	stream: BasicStream<Type>,
	pos?: number
) => boolean) &
	Partial<DirectionHaving>

export interface PositionObject<Type = any> {
	convert: (stream: BasicStream<Type>) => DirectionalPosition<Type>
	equals?: (position: Position<Type>) => boolean
	compare?: (position: Position<Type>, stream?: BasicStream<Type>) => boolean
	copy?: () => PositionObject<Type>
}

export interface Posed<Type = any> {
	pos: Type
}

export type Change<Type = any> = (input: ReversibleStream<Type>) => Type

export type * from "./MultiIndex/interfaces.js"

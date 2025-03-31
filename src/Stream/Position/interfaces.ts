import type { IReversibleStream } from "../interfaces.js"
import type { IStream } from "../interfaces.js"

export type IPosition<Type = any> =
	| IDirectionalPosition<Type>
	| IPositionObject<Type>

export type IDirectionalPosition<Type = any> = IPredicatePosition<Type> | number

export type IPredicatePosition<Type = any> = ((
	stream: IStream<Type>,
	pos?: number
) => boolean) &
	Partial<IDirectionHaving>

export interface IPositionObject<Type = any> {
	convert: (stream?: IStream<Type, any, any>) => IDirectionalPosition<Type>
	equals?: (position: IPosition<Type>) => boolean
	compare?: (position: IPosition<Type>, stream?: IStream<Type>) => boolean
}

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<Type = any> = (input: IReversibleStream<Type>) => Type

export interface IDirectionHaving {
	direction: boolean
}

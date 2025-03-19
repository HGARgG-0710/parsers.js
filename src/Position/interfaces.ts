import type { IReversibleStream } from "../Stream/ReversibleStream/interfaces.js"
import type { IBasicStream } from "../Stream/interfaces.js"

export type IPosition<Type = any> = IDirectionalPosition<Type> | IPositionObject<Type>
export type IDirectionalPosition<Type = any> = IPredicatePosition<Type> | number
export type IPredicatePosition<Type = any> = ((
	stream: IBasicStream<Type>,
	pos?: number
) => boolean) &
	Partial<IDirectionHaving>

export interface IPositionObject<Type = any> {
	convert: (stream?: IBasicStream<Type>) => IDirectionalPosition<Type>
	equals?: (position: IPosition<Type>) => boolean
	compare?: (position: IPosition<Type>, stream?: IBasicStream<Type>) => boolean
	copy?: () => IPositionObject<Type>
}

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<Type = any> = (input: IReversibleStream<Type>) => Type

export interface IDirectionHaving {
	direction: boolean
}

export type * from "./MultiIndex/interfaces.js"

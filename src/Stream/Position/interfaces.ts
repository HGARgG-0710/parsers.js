import type { IReversibleStream, IStream } from "../interfaces.js"

export type IPosition<Type = any> = IPredicatePosition<Type> | number

export type IPredicatePosition<Type = any> = ((
	stream: IStream<Type>,
	pos?: unknown
) => boolean) &
	Partial<IDirectionHaving>

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<Type = any, PosType = any> = (
	input: IReversibleStream<Type, PosType>
) => Type

export interface IDirectionHaving {
	direction: boolean
}

export type * from "./interfaces/LineIndex.js"

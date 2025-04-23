import type { IReversibleStream, IStream } from "../interfaces.js"

export type IPosition<Type = any, SubType = any> =
	| IPredicatePosition<Type, SubType>
	| number

export type IPredicatePosition<Type = any, SubType = any> = ((
	stream: IStream<Type, SubType>,
	pos?: unknown
) => boolean) &
	Partial<IDirectionHaving>

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<Type = any, SubType = any, PosType = any> = (
	input: IReversibleStream<Type, SubType, PosType>
) => Type

export interface IDirectionHaving {
	direction: boolean
}

export type * from "./interfaces/LineIndex.js"

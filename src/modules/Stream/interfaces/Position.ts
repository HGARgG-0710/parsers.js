import type { IReversibleStream, IStream } from "../../../interfaces/Stream.js"

export type IPosition<Type = any> = IPredicatePosition<Type> | number

export type IPredicatePosition<Type = any> = ((
	stream: IStream<Type>,
	pos?: IPosition
) => boolean) &
	Partial<IDirectionHaving>

export interface IPosed<Type = any> {
	pos: Type
}

export type IChange<Type = any> = (input: IReversibleStream<Type>) => Type

export interface IDirectionHaving {
	direction: boolean
}

export type * from "../Position/interfaces/LineIndex.js"

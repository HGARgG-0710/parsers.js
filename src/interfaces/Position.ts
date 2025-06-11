export type IPosition<Type = any> = IPredicatePosition<Type> | number

export type IPredicatePosition<In = any> = (
	item: In,
	pos?: IPosition
) => boolean

export interface IPosed<T = any> {
	pos: T
}

export type * from "../modules/Position/interfaces/LineIndex.js"

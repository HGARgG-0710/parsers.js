import type {
	IPosition,
	IPredicatePosition,
	IStream
} from "../../../interfaces.js"

export type IStreamPosition<T = any> = IPosition<IStream<T>>

export type IStreamPositionPredicate<T = any> = IPredicatePosition<IStream<T>> &
	Partial<IDirectionHaving>

export interface IDirectionHaving {
	direction: boolean
}

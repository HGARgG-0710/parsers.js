import type { IReversibleStream } from "../ReversibleStream/interfaces.js"
import type { IPosed, IPredicatePosition } from "../Position/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"

import type {
	IIsEndCurrable,
	IStreamClassInstance
} from "../StreamClass/interfaces.js"

import type { ICopiable, IFreezableBuffer, ISupered } from "../../interfaces.js"

export interface ILookaheadHaving {
	hasLookAhead: boolean
}

export interface ISinglePositionLookahead<Type = any> {
	prod: () => Type
	lookAhead: Type
}

export type IUnderPredicateStream<Type = any> = IReversibleStream<Type> &
	IIsEndCurrable &
	ICopiable

export interface IPredicateStream<Type = any>
	extends IStreamClassInstance<Type>,
		ISupered,
		ISinglePositionLookahead<Type>,
		IPattern<IReversibleStream<Type> & IIsEndCurrable>,
		ILookaheadHaving,
		Partial<IPosed<number>> {
	predicate: IPredicatePosition<Type>
}

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream,
	buffer?: IFreezableBuffer<Type>
) => IPredicateStream<Type>

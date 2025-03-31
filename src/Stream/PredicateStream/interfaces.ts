import type { IReversibleStream } from "../../interfaces.js"
import type { IPredicatePosition } from "../Position/interfaces.js"
import type { IPattern } from "src/interfaces.js"

import type { IIsEndCurrable } from "../../interfaces.js"
import type { IStreamClassInstance } from "../StreamClass/interfaces.js"

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

export type IPredicateStream<Type = any> = IStreamClassInstance<Type> &
	ISupered &
	ISinglePositionLookahead<Type> &
	IPattern<IUnderPredicateStream<Type>> &
	ILookaheadHaving & {
		predicate: IPredicatePosition<Type>
	}

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream,
	buffer?: IFreezableBuffer<Type>
) => IPredicateStream<Type>

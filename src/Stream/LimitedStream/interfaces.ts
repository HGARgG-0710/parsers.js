import type {
	IPosition,
	IPosed,
	IDirectionHaving
} from "../../Position/interfaces.js"

import type { IReversibleStream } from "../ReversibleStream/interfaces.js"

import type {
	IIsEndCurrable,
	IIsStartCurrable,
	IReversedStreamClassInstance
} from "../StreamClass/interfaces.js"

import type {
	ILookaheadHaving,
	ISinglePositionLookahead
} from "../PredicateStream/interfaces.js"

import type { IPattern } from "../../Pattern/interfaces.js"

import type { ICopiable, ISupered } from "../../interfaces.js"

export type ILimitedUnderStream<Type = any> = IReversibleStream<Type> &
	IPosed<IPosition> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable

export interface ILimitedStream<Type = any>
	extends ISinglePositionLookahead<Type>,
		IPattern<ILimitedUnderStream<Type>>,
		ILookaheadHaving,
		ISupered,
		IReversedStreamClassInstance<Type>,
		IDirectionHaving {
	from: IPosition
	to: IPosition
}

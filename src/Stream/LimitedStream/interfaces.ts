import type { IPosition, IPosed, IDirectionHaving } from "../../Position/interfaces.js"
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

import type { ISupered } from "src/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"

export type ILimitedUnderStream<Type = any> = IReversibleStream<Type> &
	IPosed<IPosition> &
	IIsEndCurrable &
	IIsStartCurrable

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

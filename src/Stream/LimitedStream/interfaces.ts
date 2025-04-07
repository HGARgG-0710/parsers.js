import type { IFreezableBuffer, IPointer } from "src/interfaces.js"

import type {
	IReversibleStream,
	IBufferized,
	ICopiable,
	ISupered
} from "../../interfaces.js"

import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"

import type {
	IPosition,
	IPosed,
	IDirectionHaving
} from "../Position/interfaces.js"

import type {
	ILookaheadHaving,
	ISinglePositionLookahead
} from "../PredicateStream/interfaces.js"

import type { IIsEndCurrable, IIsStartCurrable } from "../interfaces.js"

export type ILimitedUnderStream<Type = any> = IReversibleStream<Type> &
	IPosed<IPosition> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable

export type ILimitedStreamInitSignature<Type = any> = [
	ILimitedUnderStream<Type>,
	IPosition?,
	IPosition?,
	IFreezableBuffer<Type>?
]

export type ILimitedStream<Type = any> = ISinglePositionLookahead<Type> &
	ILookaheadHaving &
	ISupered &
	IReversedStreamClassInstance<
		Type,
		ILimitedUnderStream<Type>,
		number,
		ILimitedStreamInitSignature<Type>
	> &
	IPointer<ILimitedUnderStream<Type>> &
	IDirectionHaving &
	Partial<IBufferized<Type>> & {
		from: IPosition
		to: IPosition
	}

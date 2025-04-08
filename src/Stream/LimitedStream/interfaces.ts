import type { IFreezableBuffer, IPointer } from "src/interfaces.js"

import type {
	IReversibleStream,
	IBufferized,
	ICopiable,
	ISupered
} from "../../interfaces.js"

import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IDirectionHaving } from "../Position/interfaces.js"

import type {
	ILookaheadHaving,
	ISinglePositionLookahead
} from "../PredicateStream/interfaces.js"

import type {
	IDirectionalPosition,
	IIsEndCurrable,
	IIsStartCurrable
} from "../interfaces.js"

export type ILimitedUnderStream<Type = any> = IReversibleStream<
	Type,
	any,
	IDirectionalPosition
> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable

export type ILimitedStreamInitSignature<Type = any> = [
	ILimitedUnderStream<Type>,
	IDirectionalPosition?,
	IDirectionalPosition?,
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
		from: IDirectionalPosition
		to: IDirectionalPosition
	}

import type { IFreezableBuffer, IPointer } from "src/interfaces.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IDirectionHaving } from "../Position/interfaces.js"

import type {
	IReversibleStream,
	IBufferized,
	ICopiable,
	ISupered
} from "../../interfaces.js"

import type { ILookaheadHaving } from "../interfaces.js"
import type { IWithLookahead } from "../interfaces.js"

import type {
	IDirectionalPosition,
	IIsEndCurrable,
	IIsStartCurrable,
	IProddable
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
	IFreezableBuffer<Type>?
]

export type ILimitedStreamConstructor<Type = any> = new (
	value?: ILimitedUnderStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => ILimitedStream<Type>

export type ILimitedStream<Type = any> = IProddable<Type> &
	IWithLookahead<Type> &
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

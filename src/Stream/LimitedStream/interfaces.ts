import type { IFreezableSequence } from "src/interfaces.js"
import type { ICopiable } from "../../interfaces.js"

import type {
	IBackward,
	IPosition,
	IIsEndCurrable,
	IIsStartCurrable,
	IPosed,
	IReversedStreamClassInstance,
	IStream
} from "../interfaces.js"

export type IUnderLimitedStream<Type = any> = IStream<Type, IPosition> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable &
	IPosed<IPosition>

export type ILimitedStreamInitSignature<Type = any> = [
	IUnderLimitedStream<Type>?,
	IFreezableSequence<Type>?
]

export type ILimitedStreamConstructor<Type = any> = new (
	value?: IUnderLimitedStream<Type>,
	buffer?: IFreezableSequence<Type>
) => IConcreteLimitedStream<Type>

export type ILimitedStream<Type = any> = IStream<
	Type,
	number,
	ILimitedStreamInitSignature<Type>
> &
	IBackward<Type>

export type IConcreteLimitedStream<Type = any> = ILimitedStream<Type> &
	IReversedStreamClassInstance<
		Type,
		number,
		ILimitedStreamInitSignature<Type>
	>

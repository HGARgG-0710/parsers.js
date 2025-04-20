import type { IFreezableBuffer, IPointer } from "src/interfaces.js"
import type { ICopiable } from "../../interfaces.js"

import type {
	IBackward,
	IDirectionalPosition,
	IIsEndCurrable,
	IIsStartCurrable,
	IPosed,
	IStream
} from "../interfaces.js"

export type ILimitedUnderStream<Type = any> = IStream<
	Type,
	any,
	IDirectionalPosition
> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable &
	IPosed<IDirectionalPosition>

export type ILimitedStreamInitSignature<Type = any> = [
	ILimitedUnderStream<Type>,
	IFreezableBuffer<Type>?
]

export type ILimitedStreamConstructor<Type = any> = new (
	value?: ILimitedUnderStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => ILimitedStream<Type>

export type ILimitedStream<Type = any> = IStream<Type> &
	IBackward<Type> &
	IPointer<ILimitedUnderStream<Type>>

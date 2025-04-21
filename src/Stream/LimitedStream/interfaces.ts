import type { IFreezableBuffer } from "src/interfaces.js"
import type { ICopiable } from "../../interfaces.js"

import type {
	IBackward,
	IDirectionalPosition,
	IIsEndCurrable,
	IIsStartCurrable,
	IPosed,
	IStream
} from "../interfaces.js"

export type IUnderLimitedStream<Type = any> = IStream<
	Type,
	any,
	IDirectionalPosition
> &
	IIsEndCurrable &
	IIsStartCurrable &
	ICopiable &
	IPosed<IDirectionalPosition>

export type ILimitedStreamInitSignature<Type = any> = [
	IUnderLimitedStream<Type>,
	IFreezableBuffer<Type>?
]

export type ILimitedStreamConstructor<Type = any> = new (
	value?: IUnderLimitedStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => ILimitedStream<Type>

export type ILimitedStream<Type = any> = IStream<
	Type,
	IUnderLimitedStream<Type>,
	number,
	ILimitedStreamInitSignature<Type>
> &
	IBackward<Type>

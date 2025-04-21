import type { IReversibleStream, IStream } from "../../interfaces.js"
import type { IIsEndCurrable } from "../../interfaces.js"
import type { ICopiable, IFreezableBuffer } from "../../interfaces.js"

export type IUnderPredicateStream<Type = any> = IReversibleStream<Type> &
	IIsEndCurrable &
	ICopiable

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => IPredicateStream<Type>

export type IPredicateStream<Type = any> = IStream<
	Type,
	IUnderPredicateStream<Type>,
	number,
	IPredicateStreamInitSignature<Type>
>

export type IPredicateStreamInitSignature<Type = any> = [
	IUnderPredicateStream<Type>?,
	IFreezableBuffer<Type>?
]

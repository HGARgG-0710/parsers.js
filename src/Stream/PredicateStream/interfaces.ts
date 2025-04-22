import type { IFreezableBuffer, IIsEndCurrable } from "../../interfaces.js"

import type {
	IReversibleStream,
	IStream,
	IStreamClassInstance
} from "../../interfaces.js"

export type IUnderPredicateStream<Type = any> = IReversibleStream<Type> &
	IIsEndCurrable

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => IConcretePredicateStream<Type>

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

export type IConcretePredicateStream<Type = any> = IPredicateStream<Type> &
	IStreamClassInstance<
		Type,
		IUnderPredicateStream<Type>,
		number,
		IPredicateStreamInitSignature<Type>
	>

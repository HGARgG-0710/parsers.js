import type {
	IFreezableSequence,
	IIsEndCurrable,
	IReversibleStream,
	IStream,
	IStreamClassInstance
} from "../../interfaces.js"

export type IUnderPredicateStream<Type = any> = IReversibleStream<Type> &
	IIsEndCurrable

export type IPredicateStreamConstructor<Type = any> = new (
	value?: IUnderPredicateStream<Type>,
	buffer?: IFreezableSequence<Type>
) => IConcretePredicateStream<Type>

export type IPredicateStream<Type = any> = IStream<
	Type,
	number,
	IPredicateStreamInitSignature<Type>
>

export type IPredicateStreamInitSignature<Type = any> = [
	IUnderPredicateStream<Type>?,
	IFreezableSequence<Type>?
]

export type IConcretePredicateStream<Type = any> = IPredicateStream<Type> &
	IStreamClassInstance<Type, number, IPredicateStreamInitSignature<Type>>

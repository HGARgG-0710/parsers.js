import type { IFreezableBuffer } from "../../interfaces.js"
import type {
	IEndableStream,
	IStream,
	IStreamClassInstance
} from "../interfaces.js"

export type IMarkedStreamInitSignature<Type = any> = [
	IEndableStream<Type>?,
	IFreezableBuffer<Type>?
]

export type IMarkedStream<Type = any, MarkerType = any> = IStream<
	Type,
	IEndableStream<Type>,
	number,
	IMarkedStreamInitSignature<Type>
> & {
	currMarked: MarkerType
}

export type IMarkedStreamConstructor<Type = any, MarkerType = any> = new (
	value?: IEndableStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => IConcreteMarkedStream<Type, MarkerType>

export type IConcreteMarkedStream<Type = any, MarkerType = any> = IMarkedStream<
	Type,
	MarkerType
> &
	IStreamClassInstance<
		Type,
		IEndableStream<Type>,
		number,
		IMarkedStreamInitSignature<Type>
	>

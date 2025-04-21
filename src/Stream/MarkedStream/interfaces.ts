import type { IFreezableBuffer } from "../../interfaces.js"
import type { IEndableStream, IStream } from "../interfaces.js"

export type IMarkedStream<Type = any, MarkerType = any> = IStream<
	Type,
	IEndableStream<Type>
> & {
	currMarked: MarkerType
}

export type IMarkedStreamConstructor<Type = any, MarkerType = any> = new (
	value?: IEndableStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => IMarkedStream<Type, MarkerType>

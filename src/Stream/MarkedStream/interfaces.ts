import type { IFreezableBuffer, ISupered } from "../../interfaces.js"
import type { IEndableStream, IStreamClassInstance } from "../interfaces.js"

export type IMarkedStream<Type = any, MarkedType = any> = IStreamClassInstance<
	Type,
	IEndableStream<Type>
> &
	ISupered & {
		["constructor"]: new (
			value?: IEndableStream<Type>,
			buffer?: IFreezableBuffer<Type>
		) => IMarkedStream<Type>

		currMarked: MarkedType
		marker: (value?: IEndableStream<Type>) => MarkedType
	}

export type IMarkedStreamConstructor<Type = any, MarkerType = any> = new (
	value?: IEndableStream<Type>,
	buffer?: IFreezableBuffer<Type>
) => IMarkedStream<Type, MarkerType>

import type { IFreezableBuffer } from "src/interfaces.js"
import type { ICopiable } from "../../interfaces.js"
import type { IISCurrNested, INestedStreamImpl } from "./methods.js"

import type {
	IEndableStream,
	IStream,
	IStreamClassInstance
} from "../interfaces.js"

export type IUnderNestedStream<Type = any> = ICopiable & IEndableStream<Type>

export type INestedStreamInitSignature<Type = any, IndexType = any> = [
	IEndableStream<Type>?,
	IFreezableBuffer<Type>?,
	IndexType?
]

export type INestedStreamConstructor<Type = any, IndexType = any> = new (
	value?: IUnderNestedStream<Type>,
	buffer?: IFreezableBuffer<Type | INestedStreamImpl<Type, IndexType>>,
	index?: IndexType
) => IConcreteNestedStream<Type, IndexType>

export interface INestedStream<Type = any, IndexType = any>
	extends IStream<
			Type | INestedStream<Type, IndexType>,
			IUnderNestedStream<Type>,
			number,
			INestedStreamInitSignature<Type>
		>,
		IISCurrNested {}

export interface IConcreteNestedStream<Type = any, IndexType = any>
	extends IStreamClassInstance<
		Type | IConcreteNestedStream<Type, IndexType>,
		IUnderNestedStream<Type>,
		number,
		INestedStreamInitSignature<Type>
	> {}

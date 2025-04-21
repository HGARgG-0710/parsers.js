import type { IFreezableBuffer } from "src/interfaces.js"
import type { IEndableStream, IStream } from "../interfaces.js"

import type { ICopiable } from "../../interfaces.js"
import type { IISCurrNestable, INestedStreamImpl } from "./methods.js"

export type IUnderNestedStream<Type = any> = ICopiable & IEndableStream<Type>

export type INestedStreamInitSignature<Type = any, IndexType = any> = [
	IEndableStream<Type>?,
	IndexType?
]

export type INestedStreamConstructor<Type = any, IndexType = any> = new (
	value?: IUnderNestedStream<Type>,
	buffer?: IFreezableBuffer<Type | INestedStreamImpl<Type, IndexType>>,
	index?: IndexType
) => INestedStream<Type, IndexType>

export interface INestedStream<Type = any, IndexType = any>
	extends IStream<
			Type | INestedStream<Type, IndexType>,
			IUnderNestedStream<Type>
		>,
		IISCurrNestable {}

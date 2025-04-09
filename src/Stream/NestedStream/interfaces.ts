import type { IStreamPredicate } from "../../TableMap/interfaces.js"
import type { ILookupTable } from "../../LookupTable/interfaces.js"
import type { IFreezableBuffer, IPattern } from "src/interfaces.js"
import type { IStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"

import type { ISupered, IIndexAssignable, ICopiable } from "../../interfaces.js"

export type IUnderNestedStream<Type = any> = ICopiable & IEndableStream<Type>

export type INestedStreamInitSignature<Type = any, IndexType = any> = [
	IEndableStream<Type>?,
	IndexType?
]

export type INestedStreamConstructor<Type = any, IndexType = any> = new (
	value?: IUnderNestedStream<Type>,
	index?: IndexType,
	buffer?: IFreezableBuffer<Type | INestedStream<Type, IndexType>>
) => INestedStream<Type, IndexType>

export interface INestedStream<Type = any, IndexType = any>
	extends IStreamClassInstance<
			Type | INestedStream<Type>,
			IUnderNestedStream<Type>,
			number,
			INestedStreamInitSignature<Type, IndexType>
		>,
		ISupered,
		IPattern<IUnderNestedStream<Type>>,
		IIndexAssignable<IndexType> {
	["constructor"]: INestedStreamConstructor<Type, IndexType>
	typesTable: ILookupTable<
		any,
		IStreamPredicate<Type | INestedStream<Type>>,
		IndexType
	>
	isCurrNested: boolean
}

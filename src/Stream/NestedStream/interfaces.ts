import type { IStreamPredicate } from "../../TableMap/interfaces.js"
import type { ILookupTable } from "../../LookupTable/interfaces.js"
import type { IPattern } from "src/interfaces.js"
import type { IStreamClassInstance } from "../StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"

import type { ISupered, IIndexAssignable, ICopiable } from "../../interfaces.js"

export type IUnderNestedStream<Type = any> = ICopiable & IEndableStream<Type>

export interface INestedStream<Type = any, IndexType = any>
	extends IStreamClassInstance<
			Type | INestedStream<Type>,
			IUnderNestedStream<Type>
		>,
		ISupered,
		IPattern<IUnderNestedStream<Type>>,
		IIndexAssignable<IndexType> {
	typesTable: ILookupTable<any, IStreamPredicate>
	isCurrNested: boolean

	init: (
		value?: IEndableStream<Type>,
		index?: IndexType
	) => INestedStream<Type, IndexType>
}

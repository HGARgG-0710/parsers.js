import type { IStreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { ILookupTable } from "../../IndexMap/LookupTable/interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"

import type {
	IEndableStream,
	IStreamClassInstance
} from "../StreamClass/interfaces.js"

import type { ISupered, IIndexAssignable, ICopiable } from "../../interfaces.js"

export type IUnderNestedStream<Type = any> = ICopiable & IEndableStream<Type>

export interface INestedStream<Type = any>
	extends IStreamClassInstance<Type | INestedStream<Type>>,
		ISupered,
		IPattern<IUnderNestedStream<Type>>,
		IIndexAssignable,
		Partial<IPosed<number>> {
	constructor: new (
		value?: IEndableStream<Type>,
		index?: any
	) => INestedStream<Type>

	typesTable: ILookupTable<any, IStreamPredicate>
	currNested: boolean
}

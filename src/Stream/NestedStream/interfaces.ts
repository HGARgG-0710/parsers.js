import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type {
	FastLookupTable,
	IndexAssignable
} from "../../IndexMap/FastLookupTable/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"

export interface INestedStream<Type = any>
	extends StreamClassInstance<Type | INestedStream<Type>>,
		Superable,
		Pattern<EndableStream<Type>>,
		IndexAssignable,
		Partial<Posed<number>> {
	constructor: new (value?: EndableStream<Type>, _index?: any) => INestedStream<Type>
	typesTable: FastLookupTable<any, StreamPredicate>
	currNested: boolean
}

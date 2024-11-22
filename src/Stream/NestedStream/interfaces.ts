import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface NestedStream<Type = any>
	extends StreamClassInstance<Type | NestedStream<Type>>,
		Superable,
		Pattern<EndableStream<Type>> {
	constructor: new (value?: EndableStream<Type>, _index?: any) => NestedStream<Type>
	typesTable: FastLookupTable<any, StreamPredicate>
	currNested: boolean
}

import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { Supered } from "src/interfaces.js"
import type { LookupTable } from "../../IndexMap/LookupTable/interfaces.js"
import type { IndexAssignable } from "src/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"

export interface INestedStream<Type = any>
	extends StreamClassInstance<Type | INestedStream<Type>>,
		Supered,
		Pattern<EndableStream<Type>>,
		IndexAssignable,
		Partial<Posed<number>> {
	constructor: new (value?: EndableStream<Type>, _index?: any) => INestedStream<Type>
	typesTable: LookupTable<any, StreamPredicate>
	currNested: boolean
}

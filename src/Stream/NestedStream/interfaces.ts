import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "../../Parser/TableMap/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export interface BasicNested extends Summat {
	typesTable: FastLookupTable<any, StreamPredicate>
	currNested: boolean
}

export interface NestedStream<Type = any>
	extends BasicStream<Type | NestedStream<Type>>,
		BasicNested,
		Pattern<BasicStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | EffectiveNestedStream<Type>>,
		BasicNested,
		Superable,
		Pattern<EndableStream<Type>> {
	constructor: new (
		value?: EndableStream<Type>,
		_index?: any
	) => EffectiveNestedStream<Type>
}

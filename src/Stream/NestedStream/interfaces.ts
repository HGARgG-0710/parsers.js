import type { Summat } from "@hgargg-0710/summat.ts"
import type { Inputted } from "../StreamClass/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "../../Parser/ParserMap/interfaces.js"
import type { Superable } from "../StreamClass/interfaces.js"
import type { FastLookupTable } from "../../IndexMap/FastLookupTable/interfaces.js"

export interface BasicNested extends Summat {
	typesTable: FastLookupTable<any, StreamPredicate>
	currNested: boolean
}

export interface NestedStream<Type = any>
	extends BasicStream<Type | NestedStream<Type>>,
		Iterable<Type | NestedStream<Type>>,
		BasicNested,
		Inputted<BasicStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | EffectiveNestedStream<Type>>,
		BasicNested,
		Superable,
		Inputted<EndableStream<Type>>,
		Iterable<Type | EffectiveNestedStream<Type>> {
	constructor: new (
		input?: EndableStream<Type>,
		...x: any[]
	) => EffectiveNestedStream<Type>
}

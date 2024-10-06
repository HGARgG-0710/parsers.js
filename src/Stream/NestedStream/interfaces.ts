import type { Inputted } from "../UnderStream/interfaces.js"
import type { BasicStream } from "../interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import type { Superable } from "../StreamClass/Superable/interfaces.js"
import type { FastLookupTable } from "src/IndexMap/FastLookupTable/interfaces.js"
import type { BasicState } from "src/Parser/BasicParser/interfaces.js"

export interface BasicNested extends Superable {
	typesTable: FastLookupTable<any, StreamPredicate>
	currNested: boolean
}

export interface NestedStream<Type = any>
	extends BasicState<Type | NestedStream<Type>>,
		Iterable<Type | NestedStream<Type>>,
		BasicNested,
		Inputted<BasicStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | EffectiveNestedStream<Type>>,
		BasicNested,
		Inputted<EndableStream<Type>>,
		Iterable<Type | EffectiveNestedStream<Type>> {
	constructor: new (
		input?: EndableStream<Type>,
		...x: any[]
	) => EffectiveNestedStream<Type>
}

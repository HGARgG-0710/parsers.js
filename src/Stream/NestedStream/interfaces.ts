import type { Inputted } from "../UnderStream/interfaces.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import type { IterableStream } from "../StreamClass/Iterable/interfaces.js"
import type { Superable } from "../StreamClass/Superable/interfaces.js"
import type { FastLookupTable } from "src/IndexMap/FastLookupTable/interfaces.js"

export interface BasicNested extends Superable {
	currNested: boolean
	typesTable: FastLookupTable<any, [StreamPredicate, (null | Function)?], any>
}

export interface NestedStream<Type = any>
	extends IterableStream<Type | NestedStream<Type>>,
		BasicNested,
		Inputted<BasicStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | EffectiveNestedStream<Type>>,
		BasicNested,
		Inputted<EndableStream<Type>>,
		IterableStream<Type | EffectiveNestedStream<Type>> {
	constructor: new (
		input?: EndableStream<Type>,
		...x: any[]
	) => EffectiveNestedStream<Type>
}

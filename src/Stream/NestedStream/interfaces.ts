import type { Summat } from "@hgargg-0710/summat.ts"

import type { Inputted } from "../UnderStream/interfaces.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface Nestable<Type = any> extends Summat {
	nest(inflate?: StreamPredicate, deflate?: StreamPredicate, toplevel?: boolean): Type
}

export interface Inflatable extends Summat {
	inflate: StreamPredicate
}

export interface Deflatable extends Summat {
	deflate: StreamPredicate
}

export interface CurrNestedCheckable extends Summat {
	currNested: boolean
}

export interface Toplevel extends Summat {
	toplevel: boolean
}

export interface BasicNested
	extends CurrNestedCheckable,
		Toplevel,
		Inflatable,
		Deflatable {}

export interface NestableStream<Type = any>
	extends BasicStream<Type>,
		Nestable<NestedStream<Type>> {}

export interface NestableEndableStream<Type = any>
	extends NestableStream<Type>,
		EndableStream<Type> {}

export interface NestedStream<Type = any>
	extends IterableStream<Type | NestedStream<Type>>,
		BasicNested,
		Inputted<NestableStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | EffectiveNestedStream<Type>>,
		BasicNested,
		Inputted<NestableEndableStream<Type>>,
		IterableStream<Type | EffectiveNestedStream<Type>> {}

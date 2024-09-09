import type { Summat } from "@hgargg-0710/summat.ts"

import type { Inputted } from "../UnderStream/interfaces.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { EndableStream, StreamClassInstance } from "../StreamClass/interfaces.js"
import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"

export interface Nestable<Type = any> extends Summat {
	nest(inflate?: StreamPredicate, deflate?: StreamPredicate): Type
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

export interface Blowfish extends Inflatable, Deflatable {}

export interface NestedStream<Type = any>
	extends BasicStream<Type | NestedStream<Type>>,
		Blowfish,
		Inputted<NestableStream<Type>> {}

export interface NestableStream<Type = any>
	extends BasicStream<Type>,
		Nestable<NestedStream<Type>> {}

export interface NestedEndableStream<Type = any>
	extends BasicStream<Type | NestedEndableStream<Type>>,
		Blowfish,
		Inputted<NestableEndableStream<Type>> {}

export interface NestableEndableStream<Type = any>
	extends NestableStream<Type>,
		EndableStream<Type> {}

export interface EffectiveNestedStream<Type = any>
	extends StreamClassInstance<Type | NestedEndableStream<Type>>,
		NestedEndableStream<Type>,
		CurrNestedCheckable {}

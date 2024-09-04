import type { Summat } from "@hgargg-0710/summat.ts"

import type { StreamHandler } from "src/Parser/ParserMap/interfaces.js"
import type { EssentialStream } from "../BasicStream/interfaces.js"
import type { Inputted } from "../interfaces.js"
import type { BasicStream } from "../BasicStream/interfaces.js"
import type { Started } from "../ReversibleStream/interfaces.js"

export type InflationPredicate = StreamHandler<boolean>

export interface Nestable<Type = any> extends Summat {
	nest(inflate?: InflationPredicate, deflate?: InflationPredicate): Type
}

export interface Inflatable extends Summat {
	inflate: InflationPredicate
}

export interface Deflatable extends Summat {
	deflate: InflationPredicate
}

export interface CurrNestedCheckable extends Summat {
	currNested: boolean
}

export type NestedStreamOutType<Type = any> = Type | BaseNestableStream<Type>

export interface Blowfish extends Inflatable, Deflatable {}

export interface NestedStream<Type = any>
	extends BasicStream<Type>,
		Blowfish,
		Inputted<NestableStream<Type>> {}

export interface NestableStream<Type = any>
	extends BasicStream<Type>,
		Nestable<NestedStream<Type>> {}

export interface BaseNestedStream<Type = any>
	extends Blowfish,
		EssentialStream<Type>,
		Inputted<BaseNestableStream<Type>> {}

export interface BaseNestableStream<Type = any>
	extends EssentialStream<NestedStreamOutType<Type>>,
		Nestable<BaseNestedStream<Type>> {}

export interface EffectiveNestedStream<Type = any>
	extends BaseNestedStream<Type>,
		Started,
		CurrNestedCheckable {}

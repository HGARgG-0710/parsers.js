import type { Summat } from "@hgargg-0710/summat.ts"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter,
	streamTokenizerCurrentCondition,
	streamTokenizerCurrGetter,
	type BasicStream,
	type EssentialStream,
	type StreamHandler
} from "main.js"
import type { Inputted, Started } from "src/interfaces.js"

import { object, typeof as type, boolean } from "@hgargg-0710/one"
import { baseNestedStreamIsEnd, effectiveNestedStreamNext } from "./BasicStream.js"
const { structCheck } = object
const { isFunction } = type
const { F } = boolean

export type InflationPredicate = StreamHandler<boolean>
export interface Nestable<Type = any> extends Summat {
	nest(inflate?: InflationPredicate, deflate?: InflationPredicate): Type
}

export const isNestable = structCheck<Nestable>({ nest: isFunction })

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

export function NestedSteam<Type = any>(
	input: BaseNestableStream<Type>,
	inflate: InflationPredicate,
	deflate: InflationPredicate
): EffectiveNestedStream<Type> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter(
			{
				input,
				inflate,
				deflate,
				isStart: true,
				isEnd: false,
				curr: null,
				currNested: false
			},
			streamTokenizerCurrGetter<Type>,
			streamTokenizerCurrentCondition<Type>
		),
		effectiveNestedStreamNext<Type>,
		baseNestedStreamIsEnd<Type>
	) as EffectiveNestedStream<Type>
}

export function baseNestableStreamNest<Type = any>(
	this: BaseNestableStream<Type>,
	inflate: InflationPredicate = F,
	deflate: InflationPredicate = F
) {
	return NestedSteam<Type>(this, inflate, deflate)
}

export function NestableStream<Type = any>(
	stream: BasicStream<Type>
): BaseNestableStream<Type> {
	stream.nest = baseNestableStreamNest<Type>
	return stream as BaseNestableStream<Type>
}

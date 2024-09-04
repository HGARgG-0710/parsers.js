import {
	ForwardStreamIterationHandler,
	StreamCurrGetter,
	streamTokenizerCurrentCondition,
	streamTokenizerCurrGetter
} from "main.js"
import { effectiveNestedStreamNext } from "../BasicStream/methods.js"
import { baseNestedStreamIsEnd } from "../PreBasicStream/methods.js"
import type { BaseNestableStream, InflationPredicate, EffectiveNestedStream } from "./interfaces.js"
import { baseNestableStreamNest } from "./methods.js"


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
			}, (streamTokenizerCurrGetter<Type>),
			(streamTokenizerCurrentCondition<Type>)
		), (effectiveNestedStreamNext<Type>),
		(baseNestedStreamIsEnd<Type>)
	) as EffectiveNestedStream<Type>
}export function NestableStream<Type = any>(
	stream: BasicStream<Type>
): BaseNestableStream<Type> {
	stream.nest = (baseNestableStreamNest<Type>)
	return stream as BaseNestableStream<Type>
}


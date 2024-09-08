import { effectiveNestedStreamNext } from "./methods.js"
import { baseNestedStreamIsEnd } from "./methods.js"
import type {
	BaseNestableStream,
	InflationPredicate,
	EffectiveNestedStream
} from "./interfaces.js"
import { baseNestableStreamNest } from "./methods.js"
import {
	ForwardStreamIterationHandler,
	StreamCurrGetter
} from "../StreamClass/classes.js"
import { basicStreamInitGetter } from "../BasicStream/methods.js"
import type { BasicStream } from "../BasicStream/interfaces.js"

export function NestedSteam<Type = any>(
	input: BaseNestableStream<Type>,
	inflate: InflationPredicate,
	deflate: InflationPredicate
): EffectiveNestedStream<Type> {
	return ForwardStreamIterationHandler(
		StreamCurrGetter<Type>(
			{
				input,
				inflate,
				deflate,
				isStart: true,
				isEnd: false,
				curr: null,
				currNested: false
			},
			undefined,
			basicStreamInitGetter<Type>
		),
		effectiveNestedStreamNext<Type>,
		baseNestedStreamIsEnd<Type>
	) as EffectiveNestedStream<Type>
}

export function NestableStream<Type = any>(
	stream: BasicStream<Type>
): BaseNestableStream<Type> {
	stream.nest = baseNestableStreamNest<Type>
	return stream as BaseNestableStream<Type>
}

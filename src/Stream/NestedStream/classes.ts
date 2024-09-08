import { effectiveNestedStreamInitCurr, effectiveNestedStreamNext } from "./methods.js"
import { nestedEndableStreamIsEnd } from "./methods.js"
import type {
	InflationPredicate,
	EffectiveNestedStream,
	NestableStream,
	NestableEndableStream
} from "./interfaces.js"
import { nestableStreamNest } from "./methods.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"

export const NestableStreamClass = StreamClass({
	isCurrEnd: nestedEndableStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: effectiveNestedStreamInitCurr
})

export function NestedSteam<Type = any>(
	input: NestableEndableStream<Type>,
	inflate: InflationPredicate,
	deflate: InflationPredicate
): EffectiveNestedStream<Type> {
	const result = Inputted(NestableStreamClass(), input)
	result.inflate = inflate
	result.deflate = deflate
	result.currNested = false
	return result as EffectiveNestedStream<Type>
}

export function NestableStream<Type = any>(
	stream: EndableStream<Type>
): NestableEndableStream<Type> {
	stream.nest = nestableStreamNest<Type>
	return stream as NestableEndableStream<Type>
}

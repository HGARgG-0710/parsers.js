import { effectiveNestedStreamInitCurr, effectiveNestedStreamNext } from "./methods.js"
import { nestedEndableStreamIsEnd } from "./methods.js"
import type {
	EffectiveNestedStream,
	NestableStream,
	NestableEndableStream
} from "./interfaces.js"
import { nestableStreamNest } from "./methods.js"
import type { EndableStream } from "../StreamClass/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import { Inputted } from "../UnderStream/classes.js"

import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"
import { streamIterator } from "../IterableStream/methods.js"

export const NestableStreamClass = StreamClass({
	isCurrEnd: nestedEndableStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: effectiveNestedStreamInitCurr,
	defaultIsEnd: underStreamDefaultIsEnd
})

export function NestedSteam<Type = any>(
	input: NestableEndableStream<Type>,
	inflate: StreamPredicate,
	deflate: StreamPredicate
): EffectiveNestedStream<Type> {
	const result = Inputted(NestableStreamClass(), input)
	result.inflate = inflate
	result.deflate = deflate
	result.currNested = false
	result[Symbol.iterator] = streamIterator<Type>
	return result as EffectiveNestedStream<Type>
}

export function NestableStream<Type = any>(
	stream: EndableStream<Type>
): NestableEndableStream<Type> {
	stream.nest = nestableStreamNest<Type>
	return stream as NestableEndableStream<Type>
}

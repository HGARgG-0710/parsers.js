import { nestedStreamInitCurr, effectiveNestedStreamNext } from "./methods.js"
import { effectiveNestedStreamIsEnd } from "./methods.js"
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

export const NestedStreamClass = StreamClass({
	isCurrEnd: effectiveNestedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: nestedStreamInitCurr,
	defaultIsEnd: underStreamDefaultIsEnd,
	preInit: true
})

export function NestedSteam<Type = any>(
	input: NestableEndableStream<Type>,
	inflate: StreamPredicate,
	deflate: StreamPredicate,
	toplevel: boolean = true
): EffectiveNestedStream<Type> {
	const result = Inputted(NestedStreamClass(), input)
	result.inflate = inflate
	result.deflate = deflate
	result.toplevel = toplevel
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

import {
	nestedStreamInitCurr,
	effectiveNestedStreamNext,
	effectiveNestedStreamInitialize,
	effectiveNestedStreamIsEnd,
	nestableStreamNest
} from "./methods.js"
import type {
	EffectiveNestedStream,
	NestableStream,
	NestableEndableStream
} from "./interfaces.js"

import type { EndableStream } from "../StreamClass/interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"

import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"
import { underStreamDefaultIsEnd } from "../UnderStream/methods.js"

// * explanation: the 'preInit: true' is needed on account of 'currNested' - it would not be well to read it, only to discover that the property is `null`;
export const NestedStreamBase = StreamClass({
	isCurrEnd: effectiveNestedStreamIsEnd,
	baseNextIter: effectiveNestedStreamNext,
	initGetter: nestedStreamInitCurr,
	defaultIsEnd: underStreamDefaultIsEnd,
	preInit: true
})

export class NestedStream<Type = any>
	extends NestedStreamBase
	implements EffectiveNestedStream<Type>
{
	toplevel: boolean
	currNested: boolean

	input: NestableEndableStream<Type>
	inflate: StreamPredicate
	deflate: StreamPredicate

	init: (
		input?: NestableEndableStream<Type>,
		inflate?: StreamPredicate,
		deflate?: StreamPredicate,
		toplevel?: boolean
	) => EffectiveNestedStream<Type>

	constructor(
		input?: NestableEndableStream<Type>,
		inflate?: StreamPredicate,
		deflate?: StreamPredicate,
		toplevel: boolean = true
	) {
		super()
		this.init(input, inflate, deflate, toplevel)
		this.currNested = false
		super.init()
	}
}

Object.defineProperties(NestedStream.prototype, {
	init: { value: effectiveNestedStreamInitialize }
})

export function NestableStream<Type = any>(
	stream: EndableStream<Type>
): NestableEndableStream<Type> {
	stream.nest = nestableStreamNest<Type>
	return stream as NestableEndableStream<Type>
}

import type { BasicStream } from "../BasicStream/interfaces.js"
import { uniFinish } from "../FinishableStream/utils.js"
import { NestedSteam } from "./classes.js"
import type {
	EffectiveNestedStream,
	NestableEndableStream,
	NestedEndableStream
} from "./interfaces.js"

import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

export function nestableStreamNest<Type = any>(
	this: NestableEndableStream<Type>,
	inflate: StreamPredicate = F,
	deflate: StreamPredicate = F
) {
	return NestedSteam<Type>(this, inflate, deflate)
}

export function effectiveNestedStreamInitCurr<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	if (this.inflate(this.input)) {
		this.currNested = true
		return this.input.nest(this.inflate, this.deflate)
	}
	return this.input.curr
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) {
		uniFinish(this.curr as BasicStream<Type>)
		this.currNested = false
	}
	this.input.next()
	return effectiveNestedStreamInitCurr.call(this)
}

export function nestedEndableStreamIsEnd<Type = any>(this: NestedEndableStream<Type>) {
	return this.input.isCurrEnd() || !!this.deflate()
}

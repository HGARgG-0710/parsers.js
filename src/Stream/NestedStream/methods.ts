import { uniFinish } from "../FinishableStream/utils.js"
import { NestedStream as NestedStreamConstructor } from "./classes.js"
import type {
	EffectiveNestedStream,
	NestableEndableStream,
	NestedStream
} from "./interfaces.js"

import type { StreamPredicate } from "src/Parser/ParserMap/interfaces.js"

import { boolean } from "@hgargg-0710/one"
import { Inputted } from "../UnderStream/classes.js"
import { PRE_CURR_INIT } from "../StreamClass/methods.js"
const { F } = boolean

export function nestableStreamNest<Type = any>(
	this: NestableEndableStream<Type>,
	inflate: StreamPredicate = F,
	deflate: StreamPredicate = F,
	toplevel: boolean = true
) {
	return new NestedStreamConstructor<Type>(this, inflate, deflate, toplevel)
}

export function nestedStreamInitCurr<Type = any>(this: NestedStream<Type>) {
	if (this.inflate(this.input)) {
		this.currNested = true
		return this.input.nest(this.inflate, this.deflate, false)
	}
	return this.input.curr
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) {
		uniFinish(this.curr as NestableEndableStream<Type>)
		this.currNested = false
	}
	this.input.next()
	return this.initGetter()
}

export function effectiveNestedStreamIsEnd<Type = any>(
	this: EffectiveNestedStream<Type>
) {
	return this.input.isCurrEnd() || (!this.toplevel && this.deflate())
}

export function effectiveNestedStreamInitialize<Type = any>(
	this: EffectiveNestedStream<Type>,
	input?: NestableEndableStream<Type>,
	inflate?: StreamPredicate,
	deflate?: StreamPredicate,
	toplevel?: boolean
) {
	if (input) {
		Inputted(this, input)
		this.isStart = PRE_CURR_INIT
	}
	if (inflate) this.inflate = inflate
	if (deflate) this.deflate = deflate
	if (toplevel !== undefined) this.toplevel = toplevel
	return this
}

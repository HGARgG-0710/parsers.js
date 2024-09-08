import type { BasicStream } from "../BasicStream/interfaces.js"
import { uniFinish } from "../FinishableStream/utils.js"
import { NestedSteam } from "./classes.js"
import type {
	BaseNestableStream,
	BaseNestedStream,
	EffectiveNestedStream,
	InflationPredicate
} from "./interfaces.js"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

export function baseNestableStreamNest<Type = any>(
	this: BaseNestableStream<Type>,
	inflate: InflationPredicate = F,
	deflate: InflationPredicate = F
) {
	return NestedSteam<Type>(this, inflate, deflate)
}

export function effectiveNestedStreamNext<Type = any>(this: EffectiveNestedStream<Type>) {
	if (this.currNested) {
		uniFinish(this.curr as BasicStream<Type>)
		this.currNested = false
	}
	if (this.inflate(this.input)) {
		this.currNested = true
		return this.input.nest(this.inflate, this.deflate)
	}
	return this.input.next()
}

export function baseNestedStreamIsEnd<Type = any>(this: BaseNestedStream<Type>) {
	return this.input.isCurrEnd() || !!this.deflate()
}

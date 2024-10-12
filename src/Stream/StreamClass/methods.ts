import type { BasicStream } from "../interfaces.js"
import type { Position } from "../../Position/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"

import type {
	StreamClassInstance,
	ReversedStreamClassInstance,
	PositionalStreamClassInstance,
	PositionalReversedStreamClassInstance
} from "./interfaces.js"

import { StreamClass } from "../../constants.js"
import { delegate, delegateProperty } from "../../utils.js"

import { uniFinish, uniNavigate, uniRewind } from "./utils.js"

export function posNextHandler<Type = any>(this: PositionalStreamClassInstance<Type>) {
	const last = this.curr
	this.isStart = false
	if (this.isCurrEnd()) this.isEnd = true
	else {
		++this.pos
		this.curr = this.baseNextIter()
	}
	return last
}

export function posPrevHandler<Type = any>(
	this: PositionalReversedStreamClassInstance<Type>
) {
	const last = this.curr
	this.isEnd = false
	if (this.isCurrStart()) this.isStart = true
	else {
		--this.pos
		this.curr = this.basePrevIter()
	}
	return last
}

export function nextHandler<Type = any>(this: StreamClassInstance<Type>) {
	const last = this.curr
	this.isStart = false
	if (this.isCurrEnd()) this.isEnd = true
	else this.curr = this.baseNextIter()
	return last
}

export function prevHandler<Type = any>(this: ReversedStreamClassInstance<Type>) {
	const last = this.curr
	this.isEnd = false
	if (this.isCurrStart()) this.isStart = true
	else this.curr = this.basePrevIter()
	return last
}

export function currSetter<Type = any>(this: StreamClassInstance<Type>, value: Type) {
	return (this.realCurr = value)
}

export function baseCurr<Type = any>(this: StreamClassInstance<Type>) {
	if (this.isStart === StreamClass.PreCurrInit) {
		this.isStart = StreamClass.PostCurrInit
		return (this.realCurr = this.initGetter())
	}
	return this.currGetter && !this.isStart
		? (this.realCurr = this.currGetter())
		: this.realCurr
}

export function trivialInitialize<Type = any>(this: StreamClassInstance<Type>) {
	this.realCurr = StreamClass.DefaultRealCurr
	this.isStart = StreamClass.PreCurrInit
	this.isEnd = this.defaultIsEnd()
}

export function posInitialize<Type = any>(this: PositionalStreamClassInstance<Type>) {
	this.pos = 0
	trivialInitialize.call(this)
}

export function preInitPosInitialize<Type = any>(
	this: PositionalStreamClassInstance<Type>
) {
	posInitialize.call(this)
	// note: call to the 'initGetter' (IN CASE IT'S PRESENT); Otherwise, a no-op
	if (!this.isEnd) this.curr
}

export function preInitInitialize<Type = any>(this: StreamClassInstance<Type>) {
	trivialInitialize.call(this)
	if (!this.isEnd) this.curr
}

export function baseStreamInitialize(preInit?: boolean, hasPosition?: boolean) {
	return hasPosition
		? preInit
			? preInitPosInitialize
			: posInitialize
		: preInit
		? preInitInitialize
		: trivialInitialize
}

export function finish<Type = any>(this: BasicStream<Type>) {
	return uniFinish(this)
}

export function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

/**
 * A definition of `.navigate` method that works for any `Stream`
 * 		(used as default, overriden in some classes for performance reasons)
 */
export function navigate<Type = any>(
	this: BasicReversibleStream<Type>,
	position: Position
) {
	return uniNavigate(this, position)
}

/**
 * A definition of `.rewind` that works for any `BasicReversibleStream`
 * 		(used as default, overriden in some classes for performance reasons)
 */
export function rewind<Type = any>(this: BasicReversibleStream<Type>) {
	return uniRewind(this)
}

export const [inputDelegate, inputPropDelegate] = [delegate, delegateProperty].map((x) =>
	x("input")
)

export const [inputPrev, inputNext, inputIsEnd, inputIsStart, inputRewind, inputFinish] =
	["prev", "next", "isCurrEnd", "isCurrStart", "rewind", "finish"].map(inputDelegate)

export const [inputCurr, inputDefaultIsEnd, inputDefaultIsStart] = [
	"curr",
	"isEnd",
	"isStart"
].map(inputPropDelegate)

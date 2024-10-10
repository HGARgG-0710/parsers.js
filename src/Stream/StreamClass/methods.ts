import type { BasicStream } from "../interfaces.js"
import type { Position } from "../../Position/interfaces.js"
import type { BasicReversibleStream } from "../ReversibleStream/interfaces.js"

import type {
	BoundNameType,
	BaseIterPropNameType,
	IterCheckPropNameType,
	StreamClassInstance
} from "./interfaces.js"

import { uniFinish, uniNavigate, uniRewind } from "./utils.js"

import { StreamClass } from "../../constants.js"
import { delegate, delegateProperty } from "src/utils.js"

export function iterationHandler(
	boundName: BoundNameType,
	otherEnd: BoundNameType,
	baseIterPropName: BaseIterPropNameType,
	iterCheckPropName: IterCheckPropNameType
) {
	return function <Type = any>(this: StreamClassInstance<Type>) {
		const last = this.curr
		this[otherEnd] = false
		const lastEnd = (this[iterCheckPropName] as () => boolean)()
		if (!lastEnd) this.curr = (this[baseIterPropName] as () => Type)()
		this[boundName] = lastEnd && (this[iterCheckPropName] as () => boolean)()
		return last
	}
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

export const nextHandler = iterationHandler(
	"isEnd",
	"isStart",
	"baseNextIter",
	"isCurrEnd"
)

export const prevHandler = iterationHandler(
	"isStart",
	"isEnd",
	"basePrevIter",
	"isCurrStart"
)

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

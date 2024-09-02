import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "./BasicStream.js"
import type { PreBasicStream } from "./PreBasicStream.js"
import type { BoundCheckable } from "src/interfaces/BoundCheckable.js"
import type { BaseIterable } from "src/interfaces/BaseIterable.js"

export type CommonStream<Type = any> = BasicStream<Type> &
	BoundCheckable &
	BaseIterable<Type>

export type IterCheckPropNameType = "isCurrEnd" | "isCurrStart"
export type BaseIterPropNameType = "baseNext" | "basePrev"
export type IterPropNameType = "next" | "prev"
export type BoundNameType = "isEnd" | "isStart"

export function iterationHandler(
	boundName: BoundNameType,
	baseIterPropName: BaseIterPropNameType,
	iterCheckPropName: IterCheckPropNameType
) {
	return function <Type = any>(this: PreBasicStream<Type>) {
		const last = this.curr
		const lastEnd = this[iterCheckPropName]()
		if (!lastEnd) this.curr = this[baseIterPropName]()
		this[boundName] = lastEnd && this[iterCheckPropName]()
		return last
	}
}

export function StreamIterationHandler(
	boundName: BoundNameType,
	iterPropName: IterPropNameType,
	baseIterPropName: BaseIterPropNameType,
	iterCheckPropName: IterCheckPropNameType
) {
	const basicHandler = iterationHandler(boundName, baseIterPropName, iterCheckPropName)
	return function <Type = any>(
		prestream: PreBasicStream<Type>,
		baseIter: () => Type,
		iterCheck: () => boolean
	): CommonStream<Type> {
		prestream[iterCheckPropName] = iterCheck
		prestream[baseIterPropName] = baseIter
		prestream[iterPropName] = basicHandler<Type>
		return prestream as CommonStream<Type>
	}
}

export const ForwardStreamIterationHandler = StreamIterationHandler(
	"isEnd",
	"next",
	"baseNext",
	"isCurrEnd"
)
export const BackwardStreamIterationHandler = StreamIterationHandler(
	"isStart",
	"prev",
	"basePrev",
	"isCurrStart"
)

export function StreamCurrGetter<Type = any>(
	stream: Summat,
	getter: () => Type,
	returnSetCurrentCondition: () => boolean = () => false
): PreBasicStream<Type> {
	return Object.defineProperties(stream, {
		realCurr: {
			writable: true,
			value: null
		},
		curr: {
			set: function (value) {
				return (this.realCurr = value)
			},
			get: function () {
				return returnSetCurrentCondition.call(this)
					? this.realCurr
					: getter.call(this)
			}
		}
	}) as PreBasicStream<Type>
}

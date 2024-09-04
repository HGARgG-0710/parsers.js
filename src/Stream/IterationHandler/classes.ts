import type {
	BoundNameType,
	IterPropNameType,
	BaseIterPropNameType,
	IterCheckPropNameType,
	CommonStream
} from "./interfaces.js"
import { iterationHandler, currSetter } from "./methods.js"
import type { PreBasicStream } from "../PreBasicStream/interfaces.js"
import type { Summat } from "@hgargg-0710/summat.ts"

import { boolean } from "@hgargg-0710/one"
const { F } = boolean

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
	returnSetCurrentCondition: () => boolean = F
): PreBasicStream<Type> {
	return Object.defineProperties(stream, {
		realCurr: {
			writable: true,
			value: null
		},
		curr: {
			set: currSetter,
			get: function () {
				return returnSetCurrentCondition.call(this)
					? this.realCurr
					: getter.call(this)
			}
		}
	}) as PreBasicStream<Type>
}

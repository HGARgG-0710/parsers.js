import type { StreamClassSignature, StreamClassInstance } from "./interfaces.js"
import {
	currSetter,
	baseCurr,
	PRE_CURR_INIT,
	nextHandler,
	prevHandler
} from "./methods.js"

export function StreamClass<Type = any>(
	signature: StreamClassSignature<Type>
): () => StreamClassInstance<Type> {
	const {
		baseNextIter,
		isCurrEnd,
		isCurrStart,
		basePrevIter,
		initGetter,
		currGetter,
		defaultIsEnd,
		preInit
	} = signature
	return () => {
		const initial = Object.defineProperty(
			{
				realCurr: null,
				isStart: PRE_CURR_INIT,
				baseNextIter,
				isCurrEnd,
				isCurrStart,
				basePrevIter,
				currGetter,
				initGetter: (initGetter || currGetter) as () => Type,
				next: nextHandler,
				prev: prevHandler
			} as StreamClassInstance<Type>,
			"curr",
			{
				set: currSetter<Type>,
				get: baseCurr<Type>
			}
		)
		initial.isEnd = defaultIsEnd.call(initial)
		// note: call to the constructor (IN CASE IT'S PRESENT); Otherwise, a no-op
		if (preInit && !initial.isEnd) initial.curr
		return initial
	}
}

import { finish } from "../FinishableStream/methods.js"
import { streamIterator } from "../IterableStream/methods.js"
import { navigate } from "../NavigableStream/methods.js"
import { rewind } from "../RewindableStream/methods.js"
import type {
	StreamClassSignature,
	StreamClassInstance,
	StartedType
} from "./interfaces.js"
import {
	currSetter,
	baseCurr,
	PRE_CURR_INIT,
	nextHandler,
	prevHandler
} from "./methods.js"

export function StreamClass<Type = any>(
	signature: StreamClassSignature<Type>
): { new (): StreamClassInstance<Type> } {
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

	class streamClass implements StreamClassInstance<Type> {
		realCurr: any
		isStart: StartedType
		isEnd: boolean
		curr: Type

		baseNextIter: () => Type
		next: () => Type
		currGetter: () => Type
		initGetter: () => Type
		isCurrEnd: () => boolean

		navigate: () => Type
		finish: () => Type;
		[Symbol.iterator]: () => Generator<Type>

		init(): void {
			this.realCurr = null
			this.isStart = PRE_CURR_INIT
			this.isEnd = defaultIsEnd.call(this)
			// note: call to the 'initGetter' (IN CASE IT'S PRESENT); Otherwise, a no-op
			if (preInit && !this.isEnd) this.curr
		}
	}

	Object.defineProperties(streamClass, {
		baseNextIter: { value: baseNextIter },
		isCurrEnd: { value: isCurrEnd },
		isCurrStart: { value: isCurrStart },
		basePrevIter: { value: basePrevIter },
		currGetter: { value: currGetter },
		initGetter: { value: (initGetter || currGetter) as () => Type },
		next: { value: nextHandler },
		prev: { value: prevHandler },
		curr: {
			set: currSetter<Type>,
			get: baseCurr<Type>
		},
		navigate: { value: navigate },
		rewind: { value: rewind },
		finish: { value: finish },
		[Symbol.iterator]: { value: streamIterator<Type> }
	})

	return streamClass
}

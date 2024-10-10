import type { Summat } from "@hgargg-0710/summat.ts"

import { StreamClass as StreamClassNamespace } from "src/constants.js"
import { AssignmentClass } from "src/utils.js"

import type {
	StreamClassSignature,
	StreamClassInstance,
	StartedType,
	Stateful as StatefulType,
	Inputted as InputtedType
} from "./interfaces.js"

import {
	rewind,
	navigate,
	streamIterator,
	finish,
	currSetter,
	baseCurr,
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
			this.realCurr = StreamClassNamespace.DefaultRealCurr
			this.isStart = StreamClassNamespace.PreCurrInit
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

export const Stateful = AssignmentClass<object, StatefulType>("state")
export const Inputted = AssignmentClass<any, InputtedType>("input")

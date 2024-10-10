import type { Summat } from "@hgargg-0710/summat.ts"
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
	prevHandler,
	baseStreamInitialize,
	posNextHandler,
	posPrevHandler
} from "./methods.js"

import { AssignmentClass } from "src/utils.js"

const IterationStreamClassPrototypeProps = {
	next: { value: nextHandler },
	prev: { value: prevHandler }
}

const IterationStreamClassPositionalPrototypeProps = {
	next: { value: posNextHandler },
	prev: { value: posPrevHandler }
}

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
		hasPosition,
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
		defaultIsEnd: () => boolean
		isCurrEnd: () => boolean

		navigate: () => Type
		finish: () => Type
		init: (...x: any[]) => void;
		[Symbol.iterator]: () => Generator<Type>
	}

	Object.defineProperties(streamClass.prototype, {
		baseNextIter: { value: baseNextIter },
		isCurrEnd: { value: isCurrEnd },
		isCurrStart: { value: isCurrStart },
		basePrevIter: { value: basePrevIter },
		currGetter: { value: currGetter },
		initGetter: { value: (initGetter || currGetter) as () => Type },
		defaultIsEnd: { value: defaultIsEnd },
		curr: {
			set: currSetter<Type>,
			get: baseCurr<Type>
		},
		navigate: { value: navigate },
		rewind: { value: rewind },
		finish: { value: finish },
		[Symbol.iterator]: { value: streamIterator<Type> }
	})

	// * Adding the '.pos'-specific stream-iteration methods;
	Object.defineProperties(
		streamClass.prototype,
		hasPosition
			? IterationStreamClassPositionalPrototypeProps
			: IterationStreamClassPrototypeProps
	)

	// * Adding the initialization method
	Object.defineProperty(streamClass.prototype, "init", {
		value: baseStreamInitialize(preInit, hasPosition)
	})

	return streamClass
}

export const Stateful = AssignmentClass<Summat, StatefulType>("state")
export const Inputted = AssignmentClass<any, InputtedType>("input")

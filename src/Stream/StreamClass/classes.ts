import type { Constructor } from "../../interfaces.js"
import type {
	StreamClassSignature,
	StreamClassInstance,
	StartedType,
	Inputted as InputtedType
} from "./interfaces.js"

import {
	finish,
	rewind,
	navigate,
	streamIterator,
	curr,
	init,
	next,
	prev
} from "./methods.js"

import { AssignmentClass } from "../../utils.js"

export function StreamClass<Type = any>(
	signature: StreamClassSignature<Type>
): Constructor<StreamClassInstance<Type>> {
	const {
		baseNextIter,
		isCurrEnd,
		isCurrStart,
		basePrevIter,
		initGetter,
		currGetter,
		defaultIsEnd,
		hasPosition,
		preInit,
		state,
		buffer
	} = signature

	abstract class streamClass implements StreamClassInstance<Type> {
		isStart: StartedType
		isEnd: boolean
		curr: Type
		realCurr: Type

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

	// * Defining the basic properties
	Object.defineProperties(streamClass.prototype, {
		curr: curr.chooseMethod(currGetter, hasPosition, buffer),
		isCurrEnd: { value: isCurrEnd },
		baseNextIter: { value: baseNextIter },
		defaultIsEnd: { value: defaultIsEnd },
		[Symbol.iterator]: { value: streamIterator<Type> }
	})

	// * Defining the mandatory non-primary methods with optional pos-buffer optimizations
	Object.defineProperties(streamClass.prototype, {
		navigate: { value: navigate.chooseMethod<Type>(hasPosition, buffer) },
		rewind: { value: rewind.chooseMethod<Type>(hasPosition, buffer) },
		finish: { value: finish.chooseMethod<Type>(hasPosition, buffer) }
	})

	// * Defining the ReversedStreamClassInstance-specific optional properties
	Object.defineProperties(streamClass.prototype, {
		...(isCurrStart ? { isCurrStart: { value: isCurrStart } } : {}),
		...(basePrevIter ? { basePrevIter: { value: basePrevIter } } : {}),
		...(currGetter ? { currGetter: { value: currGetter } } : {}),
		...(initGetter ? { initGetter: { value: initGetter } } : {})
	})

	// * Adding the '.pos'-specific stream-iteration methods
	Object.defineProperties(streamClass.prototype, {
		next: { value: next.chooseMethod<Type>(hasPosition, buffer) },
		prev: { value: prev.chooseMethod<Type>(hasPosition, buffer) }
	})

	// * Adding the initialization method
	Object.defineProperty(streamClass.prototype, "init", {
		value: init.chooseMethod<Type>(preInit, hasPosition, buffer, state)
	})

	return streamClass
}

export const Inputted = AssignmentClass<any, InputtedType>("input")

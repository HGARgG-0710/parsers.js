import type { InitMethod } from "./methods/init.js"

import type {
	StreamClassSignature,
	StreamClassInstance,
	StartedType,
	StreamConstructor,
	PatternStreamConstructor
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

import { BasicPattern } from "../../Pattern/classes.js"

export function StreamClass<Type = any>(
	signature: StreamClassSignature<Type>
): StreamConstructor<Type> | PatternStreamConstructor<Type> {
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
		buffer,
		isPattern
	} = signature

	let streamClass: StreamConstructor<Type> | PatternStreamConstructor<Type>

	interface streamClassGuaranteed {
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
		init: InitMethod
		[Symbol.iterator]: () => Generator<Type>
	}

	if (isPattern) {
		interface _streamClass extends streamClassGuaranteed {}
		abstract class _streamClass
			extends BasicPattern
			implements StreamClassInstance<Type>
		{
			constructor(value: any) {
				super(value)
			}
		}
		streamClass = _streamClass
	} else {
		interface _streamClass extends streamClassGuaranteed {}
		abstract class _streamClass implements StreamClassInstance<Type> {}
		streamClass = _streamClass
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
		value: init.chooseMethod(
			preInit,
			hasPosition,
			buffer,
			state,
			isPattern,
			currGetter
		)
	})

	return streamClass
}

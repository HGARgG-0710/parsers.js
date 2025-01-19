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
} from "./refactor.js"

import { BasicPattern } from "src/Pattern/abstract.js"
import { addProperty } from "src/refactor.js"
import { extendPrototype } from "src/refactor.js"
import { valuePropDelegate } from "src/refactor.js"

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

	const extend = (properties: PropertyDescriptorMap) =>
		extendPrototype(streamClass, properties)

	// * Defining the basic properties
	extend({
		curr: curr.chooseMethod(currGetter, hasPosition, buffer),
		isCurrEnd: { value: isCurrEnd },
		baseNextIter: { value: baseNextIter },
		defaultIsEnd: { value: defaultIsEnd },
		[Symbol.iterator]: { value: streamIterator<Type> }
	})

	// * Defining the mandatory non-primary methods with optional pos-buffer optimizations
	extend({
		navigate: { value: navigate.chooseMethod<Type>(hasPosition, buffer) },
		rewind: { value: rewind.chooseMethod<Type>(hasPosition, buffer) },
		finish: { value: finish.chooseMethod<Type>(hasPosition, buffer) }
	})

	// * Defining the ReversedStreamClassInstance-specific optional properties
	extend({
		...(isCurrStart ? { isCurrStart: { value: isCurrStart } } : {}),
		...(basePrevIter ? { basePrevIter: { value: basePrevIter } } : {}),
		...(currGetter ? { currGetter: { value: currGetter } } : {}),
		...(initGetter ? { initGetter: { value: initGetter } } : {})
	})

	// * Adding the '.pos'-specific stream-iteration methods
	extend({
		next: { value: next.chooseMethod<Type>(hasPosition, buffer) },
		prev: { value: prev.chooseMethod<Type>(hasPosition, buffer) }
	})

	// * Adding the initialization method
	addProperty(streamClass, "init", {
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

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<StreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

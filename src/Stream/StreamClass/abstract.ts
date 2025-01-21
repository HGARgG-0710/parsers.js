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
	iter,
	update
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

	streamClass = (() => {
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
			return _streamClass
		}
		interface _streamClass extends streamClassGuaranteed {}
		abstract class _streamClass implements StreamClassInstance<Type> {}
		return _streamClass
	})()

	const extend = (properties: PropertyDescriptorMap) =>
		extendPrototype(streamClass, properties)

	// * Defining the basic properties
	extend({
		curr: curr.chooseMethod(hasPosition, buffer),
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
	extend(iter.chooseMethod(currGetter, hasPosition, buffer))

	// * Adding the initialization method
	addProperty(streamClass, "init", {
		value: init.chooseMethod(hasPosition, buffer, state, isPattern)
	})

	if (currGetter) addProperty(streamClass, "update", { value: update })

	return streamClass
}

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<StreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

import type { InitMethod } from "./methods/init.js"
import type { BasicStream } from "../interfaces.js"
import type {
	StreamClassSignature,
	StreamClassInstance,
	StartedType,
	StreamConstructor,
	PatternStreamConstructor
} from "./interfaces.js"

import { BasicPattern } from "src/Pattern/abstract.js"

import { finish, rewind, navigate, init, iter, curr } from "./refactor.js"
import { valuePropDelegate } from "src/refactor.js"

import { object } from "@hgargg-0710/one"
const { protoProp, extendPrototype } = object
const { ConstDescriptor } = object.descriptor

function* streamIterator<Type = any>(this: BasicStream<Type>) {
	while (!this.isEnd) yield this.next()
}

function update<Type = any>(this: StreamClassInstance<Type>) {
	return (this.curr = this.currGetter!())
}

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
		curr,
		isCurrEnd: ConstDescriptor(isCurrEnd),
		baseNextIter: ConstDescriptor(baseNextIter),
		defaultIsEnd: ConstDescriptor(defaultIsEnd),
		[Symbol.iterator]: ConstDescriptor(streamIterator<Type>)
	})

	// * Defining the mandatory non-primary methods with optional pos-buffer optimizations
	extend({
		navigate: ConstDescriptor(navigate.chooseMethod<Type>(hasPosition, buffer)),
		rewind: ConstDescriptor(rewind.chooseMethod<Type>(hasPosition, buffer)),
		finish: ConstDescriptor(finish.chooseMethod<Type>(hasPosition, buffer))
	})

	// * Defining the ReversedStreamClassInstance-specific optional properties
	extend({
		...(isCurrStart ? { isCurrStart: ConstDescriptor(isCurrStart) } : {}),
		...(basePrevIter ? { basePrevIter: ConstDescriptor(basePrevIter) } : {}),
		...(currGetter ? { currGetter: ConstDescriptor(currGetter) } : {}),
		...(initGetter ? { initGetter: ConstDescriptor(initGetter) } : {})
	})

	// * Adding the '.pos'-specific stream-iteration methods
	extend(iter.chooseMethod(currGetter, hasPosition, buffer))

	// * Adding the initialization method
	protoProp(
		streamClass,
		"init",
		ConstDescriptor(init.chooseMethod(hasPosition, buffer, state, isPattern))
	)

	if (currGetter) protoProp(streamClass, "update", ConstDescriptor(update))

	return streamClass
}

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<StreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

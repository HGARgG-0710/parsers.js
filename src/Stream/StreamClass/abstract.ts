import type { IPattern } from "../../Pattern/interfaces.js"
import type { IInitMethod } from "./methods/init.js"

import type {
	IStreamClassSignature,
	IStreamClassInstance
} from "./interfaces.js"

import type { AbstractConstructor } from "./refactor.js"

import { Pattern } from "../../Pattern/abstract.js"

import { valuePropDelegate } from "../../refactor.js"
import { finish, rewind, navigate, init, iter, curr } from "./refactor.js"

import { update } from "./methods/update.js"
import { streamIterator } from "./methods/iter.js"

import { object } from "@hgargg-0710/one"
const { protoProp, extendPrototype } = object
const { ConstDescriptor } = object.descriptor

export function StreamClass<Type = any>(
	signature: IStreamClassSignature<Type>
):
	| AbstractConstructor<[], IStreamClassInstance<Type>>
	| AbstractConstructor<[any], IStreamClassInstance<Type> & IPattern> {
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

	let streamClass:
		| AbstractConstructor<[], IStreamClassInstance<Type>>
		| AbstractConstructor<[any], IStreamClassInstance<Type> & IPattern>

	interface streamClassGuaranteed {
		isStart: boolean
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
		init: IInitMethod
		[Symbol.iterator]: () => Generator<Type>
	}

	streamClass = (() => {
		if (isPattern) {
			interface _streamClass extends streamClassGuaranteed {}
			abstract class _streamClass
				extends Pattern
				implements IStreamClassInstance<Type>
			{
				constructor(value?: any) {
					super(value)
				}
			}
			return _streamClass
		}
		interface _streamClass extends streamClassGuaranteed {}
		abstract class _streamClass implements IStreamClassInstance<Type> {}
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
		navigate: ConstDescriptor(
			navigate.chooseMethod<Type>(hasPosition, buffer)
		),
		rewind: ConstDescriptor(rewind.chooseMethod<Type>(hasPosition, buffer)),
		finish: ConstDescriptor(finish.chooseMethod<Type>(hasPosition, buffer))
	})

	// * Defining the ReversedStreamClassInstance-specific optional properties
	extend({
		...(isCurrStart ? { isCurrStart: ConstDescriptor(isCurrStart) } : {}),
		...(basePrevIter
			? { basePrevIter: ConstDescriptor(basePrevIter) }
			: {}),
		...(currGetter ? { currGetter: ConstDescriptor(currGetter) } : {}),
		...(initGetter ? { initGetter: ConstDescriptor(initGetter) } : {})
	})

	// * Adding the '.pos'-specific stream-iteration methods
	extend(iter.chooseMethod(currGetter, hasPosition, buffer))

	// * Adding the initialization method
	protoProp(
		streamClass,
		"init",
		ConstDescriptor(
			init.chooseMethod(hasPosition, buffer, state, isPattern)
		)
	)

	if (currGetter) protoProp(streamClass, "update", ConstDescriptor(update))

	return streamClass
}

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<IStreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

import type { IPattern } from "../../Pattern/interfaces.js"
import type { IInitMethod } from "./methods/init.js"

import type {
	IStreamClassSignature,
	IStreamClassInstance
} from "./interfaces.js"

import type { Constructor } from "./refactor.js"

import { Pattern } from "../../Pattern/abstract.js"

import { valuePropDelegate } from "../../refactor.js"
import { finish, rewind, navigate, init, iter, curr, copy } from "./refactor.js"

import { update } from "./methods/update.js"
import { streamIterator } from "./methods/iter.js"

import { object } from "@hgargg-0710/one"
import type { ICopiable } from "../../interfaces.js"
const { protoProp, extendPrototype } = object
const { ConstDescriptor } = object.descriptor

export function StreamClass<Type = any>(
	signature: IStreamClassSignature<Type>
):
	| Constructor<[], IStreamClassInstance<Type>>
	| Constructor<[any], IStreamClassInstance<Type> & IPattern> {
	const {
		baseNextIter,
		isCurrEnd,
		isCurrStart,
		basePrevIter,
		initGetter,
		currGetter,
		defaultIsEnd,
		hasPosition: pos,
		hasState: state,
		hasBuffer: buffer,
		isPattern: value
	} = signature

	let streamClass:
		| Constructor<[], IStreamClassInstance<Type>>
		| Constructor<[any], IStreamClassInstance<Type> & IPattern>

	interface streamClassGuaranteed extends ICopiable {
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
		if (value) {
			interface _streamClass extends streamClassGuaranteed {}
			class _streamClass
				extends Pattern
				implements IStreamClassInstance<Type>
			{
				["constructor"]: new (value?: any) => typeof this
				constructor(value?: any) {
					super(value)
				}
			}
			return _streamClass
		}
		interface _streamClass extends streamClassGuaranteed {}
		class _streamClass implements IStreamClassInstance<Type> {
			["constructor"]: new () => typeof this
		}
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
		navigate: ConstDescriptor(navigate.chooseMethod<Type>(pos, buffer)),
		rewind: ConstDescriptor(rewind.chooseMethod<Type>(pos, buffer)),
		finish: ConstDescriptor(finish.chooseMethod<Type>(pos, buffer))
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
	extend(iter.chooseMethod(currGetter, pos, buffer))

	// * Adding the initialization methods
	extend({
		init: ConstDescriptor(init.chooseMethod(pos, buffer, state, value)),
		copy: ConstDescriptor(copy.chooseMethod(pos, buffer, state, value))
	})

	if (currGetter) protoProp(streamClass, "update", ConstDescriptor(update))

	return streamClass
}

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<IStreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

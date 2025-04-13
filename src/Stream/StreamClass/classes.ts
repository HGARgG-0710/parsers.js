import type { IStreamClassInitMethod } from "./methods/init.js"
import type { ICopiable, IPosition } from "../../interfaces.js"

import type {
	IStreamClass,
	IStreamClassInstance,
	IStreamClassSignature
} from "./interfaces.js"

import { Pattern } from "src/internal/Pattern.js"

import { valuePropDelegate } from "../../refactor.js"
import { finish, rewind, navigate, init, iter, curr, copy } from "./refactor.js"

import { update } from "./methods/update.js"
import { streamIterator } from "./methods/iter.js"

import { Autocache } from "../../internal/Autocache.js"

import { object } from "@hgargg-0710/one"
import { ObjectMap } from "../../IndexMap/LinearIndexMap/classes.js"
const { protoProp, extendPrototype } = object
const { ConstDescriptor } = object.descriptor

function makeStreamClass<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
>(
	signature: IStreamClassSignature<Type>
): IStreamClass<Type, SubType, PosType> {
	const {
		isCurrStart,
		basePrevIter,

		baseNextIter,
		isCurrEnd,
		initGetter,
		currGetter,
		defaultIsEnd,

		rewind: rewindOverride,
		navigate: navigateOverride,
		finish: finishOverride,

		hasPosition: pos,
		hasState: state,
		hasBuffer: buffer,
		isPattern: value
	} = signature

	let streamClass: IStreamClass<Type, SubType, PosType>

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
		init: IStreamClassInitMethod<Type, SubType, PosType>
		[Symbol.iterator]: () => Generator<Type>
	}

	streamClass = (() => {
		if (value) {
			interface _streamClass extends streamClassGuaranteed {}
			class _streamClass
				extends Pattern<SubType>
				implements IStreamClassInstance<Type, SubType, PosType>
			{
				["constructor"]: new (value?: SubType) => typeof this
				constructor(value?: SubType) {
					super(value)
				}
			}
			return _streamClass
		}
		interface _streamClass extends streamClassGuaranteed {}
		class _streamClass
			implements IStreamClassInstance<Type, SubType, PosType>
		{
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
		navigate: ConstDescriptor(
			navigateOverride || navigate.chooseMethod(pos, buffer)
		),
		rewind: ConstDescriptor(
			rewindOverride || rewind.chooseMethod(pos, buffer)
		),
		finish: ConstDescriptor(
			finishOverride || finish.chooseMethod(pos, buffer)
		)
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

export const StreamClass = new Autocache(
	new ObjectMap(),
	makeStreamClass
) as unknown as <
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
>(
	signature: IStreamClassSignature<Type>
) => IStreamClass<Type, SubType, PosType>

const valueIsEnd = valuePropDelegate("isEnd")
export const DefaultEndStream = <Type = any>(
	signature: Omit<IStreamClassSignature<Type>, "defaultIsEnd">
) => StreamClass({ defaultIsEnd: valueIsEnd, ...signature })

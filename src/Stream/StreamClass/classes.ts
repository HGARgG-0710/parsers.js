import { boolean, object } from "@hgargg-0710/one"
import { Pattern } from "src/internal/Pattern.js"
import { ObjectMap } from "../../IndexMap/LinearIndexMap/classes.js"
import type { ICopiable, IPosition } from "../../interfaces.js"
import { Autocache } from "../../internal/Autocache.js"
import { valuePropDelegate } from "../../refactor.js"
import type { IStreamClass, IStreamClassSignature } from "./interfaces.js"
import type { IStreamClassInitMethod } from "./methods/init.js"
import { streamIterator } from "./methods/iter.js"
import { update } from "./methods/update.js"
import {
	copy,
	curr,
	finish,
	init,
	iter,
	navigate,
	rewind,
	type IStreamClassInstanceImpl
} from "./refactor.js"

const { protoProp, extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { F } = boolean

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
				implements IStreamClassInstanceImpl<Type, SubType, PosType>
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
			implements IStreamClassInstanceImpl<Type, SubType, PosType>
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
		defaultIsEnd: ConstDescriptor(defaultIsEnd || F),
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
export const DefaultEndStream = <
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
>(
	signature: Omit<IStreamClassSignature<Type>, "defaultIsEnd">
) =>
	StreamClass<Type, SubType, PosType>({
		defaultIsEnd: valueIsEnd,
		...signature
	})

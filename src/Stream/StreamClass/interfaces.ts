import type {
	IFinishable,
	IIsEndCurrable,
	IIsStartCurrable,
	INavigable,
	IPosition,
	IBackward,
	IRewindable,
	IStream
} from "../interfaces.js"

import type { IStarted } from "../interfaces.js"
import type { ICopiable, IPattern } from "../../interfaces.js"
import type { ConstructorHaving } from "../../refactor.js"
import type { IConstructor } from "./refactor.js"

// * Default Methods (single signature)

export interface IUpdatable<Type = any> {
	update: () => Type
}

type IPrimalStreamClassSignature<Type = any> = IIsEndCurrable & {
	initGetter?: () => Type
	baseNextIter: () => Type
	defaultIsEnd: () => boolean
	currGetter?: () => Type
}

type IStreamClassTransferable<Type = any> = IPrimalStreamClassSignature<Type> &
	Partial<Pick<IReversedStreamClassInstance<Type>, "prev">> &
	Partial<Pick<IReversedStreamClassInstance<Type>, "basePrevIter">> &
	Partial<IIsStartCurrable>

type ICommonStreamClassInstance<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
> = IStream<Type, SubType, PosType> &
	IPrimalStreamClassSignature<Type> &
	IStarted &
	INavigable<Type, PosType> &
	IFinishable<Type> &
	ICopiable &
	ConstructorHaving

export type IStreamClassSignature<Type = any> =
	IStreamClassTransferable<Type> & {
		hasPosition?: boolean
		hasBuffer?: boolean
		hasState?: boolean
		isPattern?: boolean
	}

export type IStreamClassInstance<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
> = ICommonStreamClassInstance<Type, SubType, PosType> &
	IStreamClassTransferable<Type> &
	Partial<IUpdatable<Type>>

export type IReversedStreamClassInstance<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
> = ICommonStreamClassInstance<Type, SubType, PosType> &
	IIsStartCurrable &
	IBackward<Type> &
	IRewindable<Type> & {
		basePrevIter: () => Type
	}

export type IStreamClass<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
> =
	| IConstructor<[], IStreamClassInstance<Type, SubType, PosType>>
	| IConstructor<
			[any?],
			IStreamClassInstance<Type, SubType, PosType> & IPattern<SubType>
	  >
	| IConstructor<[], IReversedStreamClassInstance<Type, SubType, PosType>>
	| IConstructor<
			[any?],
			IReversedStreamClassInstance<Type, SubType> & IPattern<SubType>
	  >

export type * from "./methods/init.js"

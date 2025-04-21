import type { ConstructorHaving } from "../../refactor.js"
import type {
	IFinishable,
	IIsEndCurrable,
	IIsStartCurrable,
	INavigable,
	IPosition,
	IPrevable,
	IRewindable,
	IStarted,
	IStream
} from "../interfaces.js"

import type { IConstructor, IStreamClassTransferable } from "./refactor.js"

export type IStreamClassSignature<Type = any> =
	IStreamClassTransferable<Type> & {
		hasPosition?: boolean
		hasBuffer?: boolean
		hasState?: boolean
		isPattern?: boolean
	}

export type IStreamClass<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> =
	| IConstructor<[any?], IStreamClassInstance<Type, SubType, PosType>>
	| IConstructor<[any?], IReversedStreamClassInstance<Type, SubType, PosType>>

export type IStreamClassInstance<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number,
	InitSignature extends any[] = any[]
> = IStream<Type, SubType, PosType, InitSignature> &
	IStarted &
	IIsEndCurrable &
	IFinishable<Type> &
	INavigable<Type, SubType, PosType> &
	ConstructorHaving

export type IReversedStreamClassInstance<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number,
	InitSignature extends any[] = any[]
> = IStreamClassInstance<Type, SubType, PosType, InitSignature> &
	IPrevable<Type> &
	IIsStartCurrable &
	IRewindable<Type>

export type * from "./methods/init.js"

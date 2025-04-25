import type { ConstructorHaving } from "../../refactor.js"
import type {
	IFinishable,
	IIsEndCurrable,
	IIsStartCurrable,
	INavigable,
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

export type IStreamClass<Type = any, PosType = any> =
	| IConstructor<[any?], IStreamClassInstance<Type, PosType>>
	| IConstructor<[any?], IReversedStreamClassInstance<Type, PosType>>

export type IStreamClassInstance<
	Type = any,
	PosType = any,
	InitSignature extends any[] = any[]
> = IStream<Type, PosType, InitSignature> &
	IStarted &
	IIsEndCurrable &
	IFinishable<Type> &
	INavigable<Type, PosType> &
	ConstructorHaving

export type IReversedStreamClassInstance<
	Type = any,
	PosType = any,
	InitSignature extends any[] = any[]
> = IStreamClassInstance<Type, PosType, InitSignature> &
	IPrevable<Type> &
	IIsStartCurrable &
	IRewindable<Type>

export type * from "./methods/init.js"

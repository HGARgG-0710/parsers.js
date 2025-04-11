import type {
	IBufferized,
	ICopiable,
	IInitializable,
	IPattern,
	IPosition,
	IStateful
} from "../interfaces.js"

import type { IPosed } from "./Position/interfaces.js"

export interface IStarted {
	isStart: boolean
}

export interface IPrevable<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> {
	prev: (n?: IPosition<Type, SubType, PosType>) => Type
}

export type IBackward<Type = any> = IStarted & IPrevable<Type>

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> {
	navigate: (position: IPosition<Type, SubType, PosType>) => Type
}

export interface IRewindable<Type = any> {
	rewind: () => Type
}

export interface IIsEndCurrable {
	isCurrEnd: () => boolean
}

export interface IIsStartCurrable {
	isCurrStart: () => boolean
}

export interface INextable<Type = any> {
	next: (i?: IPosition) => Type
}

export type IStream<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number,
	InitSignature extends any[] = any[]
> = ICopiable &
	Partial<INavigable<Type, SubType, PosType>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>> &
	Partial<IBufferized<Type>> &
	Partial<IStateful> &
	Partial<IPosed<IPosition<Type, SubType, PosType>>> &
	Partial<IPattern<SubType>> &
	Partial<
		IInitializable<
			InitSignature,
			IStream<Type, SubType, PosType, InitSignature>
		>
	> &
	Partial<IIsEndCurrable> &
	Partial<IIsStartCurrable> &
	Iterable<Type> &
	INextable<Type> & {
		curr: Type
		isEnd: boolean
	}

export type IEndableStream<Type = any> = IStream<Type> & IIsEndCurrable

export type IReversibleStream<
	Type = any,
	SubType = any,
	PosType extends IPosition<Type, SubType, PosType> = number
> = IStream<Type, SubType, PosType> & IBackward<Type>

export type * from "./InputStream/interfaces.js"
export type * from "./LazyStream/interfaces.js"
export type * from "./LimitedStream/interfaces.js"
export type * from "./NestedStream/interfaces.js"
export type * from "./PredicateStream/interfaces.js"
export type * from "./StreamClass/interfaces.js"
export type * from "./StreamParser/interfaces.js"
export type * from "./TreeStream/interfaces.js"
export type * from "./Position/interfaces.js"

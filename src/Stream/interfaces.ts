import type {
	IBufferized,
	ICopiable,
	IInitializable,
	IPattern,
	IPosition,
	IStateful
} from "../interfaces.js"

import type { IPosed } from "./Position/interfaces.js"

export type IEndableStream<Type = any> = IStream<Type> & IIsEndCurrable

export interface IStarted {
	isStart: boolean
}

export interface IPrevable<Type = any> {
	prev: (n?: IPosition<Type>) => Type
}

export type IBackward<Type = any> = IStarted & IPrevable<Type>

export type IReversibleStream<
	Type = any,
	SubType = any,
	PosType extends IPosition = number
> = IStream<Type, SubType, PosType> & IBackward<Type>

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<Type = any, PosType extends IPosition = number> {
	navigate: (position: PosType) => Type
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
	PosType extends IPosition = number
> = ICopiable &
	Partial<INavigable<Type, PosType>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>> &
	Partial<IBufferized<Type>> &
	Partial<IStateful> &
	Partial<IPosed<PosType>> &
	Partial<IPattern<SubType>> &
	Partial<IInitializable<any[], IStream<Type, SubType, PosType>>> &
	Partial<IIsEndCurrable> &
	Partial<IIsStartCurrable> &
	Iterable<Type> &
	INextable<Type> & {
		curr: Type
		isEnd: boolean
	}

export type * from "./InputStream/interfaces.js"
export type * from "./LimitedStream/interfaces.js"
export type * from "./NestedStream/interfaces.js"
export type * from "./PredicateStream/interfaces.js"
export type * from "./StreamClass/interfaces.js"
export type * from "./StreamParser/interfaces.js"
export type * from "./TreeStream/interfaces.js"
export type * from "./Position/interfaces.js"

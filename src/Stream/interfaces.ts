import type { ICopiable, IInitializable, IStateful } from "../interfaces.js"

export interface IStarted {
	isStart: boolean
}

export interface IPrevable<Type = any> {
	prev: () => Type
}

export type IBackward<Type = any> = IStarted & IPrevable<Type>

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<Type = any> {
	navigate: (position: unknown) => Type
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
	next: () => Type
}

export type IStream<Type = any, InitSignature extends any[] = any[]> = Partial<
	IBackward<Type>
> &
	Partial<INavigable<Type>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>> &
	Partial<IStateful> &
	Partial<IInitializable<InitSignature, IStream<Type, InitSignature>>> &
	Partial<IIsEndCurrable> &
	Partial<IIsStartCurrable> &
	Iterable<Type> &
	ICopiable &
	INextable<Type> & {
		curr: Type
		isEnd: boolean
	}

export type IEndableStream<Type = any> = IStream<Type> & IIsEndCurrable

export type IReversibleStream<
	Type = any,
	InitSignature extends any[] = any[]
> = IStream<Type, InitSignature> & IBackward<Type>

export type * from "./interfaces/IndexStream.js"
export type * from "./interfaces/LimitedStream.js"
export type * from "./interfaces/MarkerStream.js"
export type * from "./interfaces/NestedStream.js"
export type * from "./interfaces/OwnedStream.js"

export type * from "./Position/interfaces.js"
export type * from "./StreamParser/interfaces.js"

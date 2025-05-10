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

export interface IIsCurrStartable {
	isCurrStart: () => boolean
}

export interface INextable<Type = any> {
	next: () => Type
}

export interface IPeekable<Type = any> {
	peek: (n: number) => Type
}

export interface IStreamIdentifiable<T extends boolean = boolean> {
	readonly isStream?: T
}

export interface ILazyIdentifiable {
	readonly isLazy?: boolean
}

export interface IResourceful {
	readonly resource: Partial<IStreamIdentifiable>
}

export type IStream<Type = any> = Partial<IBackward<Type>> &
	Partial<INavigable<Type>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>> &
	Partial<IStateful> &
	Partial<IInitializable> &
	Partial<IIsCurrStartable> &
	Partial<IPeekable<Type>> &
	Partial<IResourceful> &
	ILazyIdentifiable &
	IStreamIdentifiable<true> &
	Iterable<Type> &
	ICopiable &
	INextable<Type> &
	IInitializable & {
		readonly curr: Type
		readonly isEnd: boolean
		isCurrEnd: () => boolean
	}

export type IReversibleStream<Type = any> = IStream<Type> & IBackward<Type>
export type IPeekableStream<Type = any> = IStream<Type> & IPeekable<Type>
export type IResourcefulStream<Type = any> = IStream<Type> & IResourceful

export type * from "./interfaces/ComposedStream.js"
export type * from "./interfaces/IndexStream.js"
export type * from "./interfaces/LimitedStream.js"
export type * from "./interfaces/MarkerStream.js"
export type * from "./interfaces/OwnedStream.js"
export type * from "./interfaces/SingletonStream.js"

export type * from "./StreamInitializer/interfaces.js"
export type * from "./Position/interfaces.js"

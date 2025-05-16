import type {
	ICopiable,
	IInitializable,
	IOwnedStream,
	IPosition,
	IStateful,
	IStateSettable
} from "../interfaces.js"

export interface IStarted {
	readonly isStart: boolean
}

export interface IPrevable<Type = any> {
	prev: () => Type
}

export type IBackward<Type = any> = IStarted & IPrevable<Type>

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<Type = any> {
	navigate: (position: IPosition<Type>) => Type
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

export interface IResourceful {
	readonly resource?: IOwnedStream
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
export type IStatefulStream<Type = any> = IStream<Type> &
	IStateful &
	IStateSettable

export type * from "../Stream/interfaces/CompositeStream.js"
export type * from "../Stream/interfaces/IndexStream.js"
export type * from "../Stream/interfaces/InputStream.js"
export type * from "../Stream/interfaces/LimitStream.js"
export type * from "../Stream/interfaces/MarkerStream.js"
export type * from "../Stream/interfaces/OwnedStream.js"
export type * from "../Stream/interfaces/PeekStream.js"
export type * from "../Stream/interfaces/Position.js"
export type * from "../Stream/interfaces/SingletonStream.js"

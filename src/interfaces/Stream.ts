import type {
	ICopiable,
	IInitializable,
	IOwnedStream,
	IStateful,
	IStateSettable
} from "../interfaces.js"
import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"

export interface IPrevable {
	prev: () => void
}

export interface IFinishable<Type = any> {
	finish: () => Type
}

export interface INavigable<Type = any> {
	navigate: (position: IStreamPosition<Type>) => Type
}

export interface IRewindable<Type = any> {
	rewind: () => Type
}

export interface IIsCurrStartable {
	isCurrStart: () => boolean
}

export interface IPeekable<Type = any> {
	peek: (n: number) => Type
}

export interface IResourceful {
	readonly resource?: IOwnedStream
}

export type IStream<Type = any> = Partial<INavigable<Type>> &
	Partial<IFinishable<Type>> &
	Partial<IRewindable<Type>> &
	Partial<IStateful> &
	Partial<IInitializable> &
	Partial<IIsCurrStartable> &
	Partial<IPeekable<Type>> &
	Partial<IResourceful> &
	Partial<IPrevable> &
	Iterable<Type> &
	ICopiable &
	IInitializable & {
		readonly curr: Type
		readonly isEnd: boolean
		readonly isStart: boolean
		isCurrEnd: () => boolean
		next: () => void
	}

export type IPrevableStream<Type = any> = IStream<Type> & IPrevable
export type IPeekableStream<Type = any> = IStream<Type> & IPeekable<Type>
export type IResourcefulStream<Type = any> = IStream<Type> & IResourceful
export type IStatefulStream<Type = any> = IStream<Type> &
	IStateful &
	IStateSettable

export type IChange<Type = any> = (input: IPrevableStream<Type>) => Type

export type * from "../modules/Stream/interfaces/CompositeStream.js"
export type * from "../modules/Stream/interfaces/IndexStream.js"
export type * from "../modules/Stream/interfaces/InputStream.js"
export type * from "../modules/Stream/interfaces/LimitStream.js"
export type * from "../modules/Stream/interfaces/MarkerStream.js"
export type * from "../modules/Stream/interfaces/OwnedStream.js"
export type * from "../modules/Stream/interfaces/PeekStream.js"
export type * from "../modules/Stream/interfaces/SingletonStream.js"
export type * from "../modules/Stream/interfaces/StreamPosition.js"

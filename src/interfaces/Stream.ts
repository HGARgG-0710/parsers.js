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

export interface IFinishable<T = any> {
	finish: () => T
}

export interface INavigable<T = any> {
	navigate: (position: IStreamPosition<T>) => T
}

export interface IRewindable<T = any> {
	rewind: () => T
}

export interface IIsCurrStartable {
	isCurrStart: () => boolean
}

export interface IPeekable<T = any> {
	peek: (n: number) => T
}

interface IResourceful {
	readonly resource?: IOwnedStream
}

export type IStream<T = any> = Partial<INavigable<T>> &
	Partial<IFinishable<T>> &
	Partial<IRewindable<T>> &
	Partial<IStateful> &
	Partial<IInitializable> &
	Partial<IIsCurrStartable> &
	Partial<IPeekable<T>> &
	Partial<IResourceful> &
	Partial<IPrevable> &
	Iterable<T> &
	ICopiable &
	IInitializable & {
		readonly curr: T
		readonly isEnd: boolean
		readonly isStart: boolean
		isCurrEnd: () => boolean
		next: () => void
	}

export type IPrevableStream<T = any> = IStream<T> & IPrevable
export type IPeekableStream<T = any> = IStream<T> & IPeekable<T>
export type IResourcefulStream<T = any> = IStream<T> & IResourceful
export type IStatefulStream<T = any> = IStream<T> &
	IStateful &
	IStateSettable

export type IChange<T = any> = (input: IPrevableStream<T>) => T

export type * from "../modules/Stream/interfaces/CompositeStream.js"
export type * from "../modules/Stream/interfaces/IndexStream.js"
export type * from "../modules/Stream/interfaces/InputStream.js"
export type * from "../modules/Stream/interfaces/LimitStream.js"
export type * from "../modules/Stream/interfaces/MarkerStream.js"
export type * from "../modules/Stream/interfaces/OwnedStream.js"
export type * from "../modules/Stream/interfaces/PeekStream.js"
export type * from "../modules/Stream/interfaces/SingletonStream.js"
export type * from "../modules/Stream/interfaces/StreamPosition.js"

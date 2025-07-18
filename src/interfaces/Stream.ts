import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICopiable,
	IInitializable,
	IOwnedStream,
	IParseState,
	IPosed,
	IStateHaving,
	IStateSettable
} from "../interfaces.js"
import type { IStreamPosition } from "../modules/Stream/interfaces/StreamPosition.js"

/**
 * An interface for specifying a presence of a `.prev` method.
 * It is intended (primarily) for backwards iteration (on sequence
 * types) by one element.
 */
export interface IPrevable {
	prev: () => void
}

/**
 * An interface for specifying a presence of a `.finish` method.
 * It is intended for going to the end (in sequences). Returns the
 * new current element of the sequence.
 */
export interface IFinishable<T = any> {
	finish: () => T
}

/**
 * An interface for specifying a presence of a `.navigate(position: IStreamPosition<T>) => T`.
 * Intended to be used with `IStream`. Accepts an `IStreamPosition<T>`, at which the stop must
 * be made. The position is signalled either as finite-relative (`number`), or predicate-relative
 * (`IStreamPositionPredicate<T>`). In the latter case, `false` usually means that the place of
 * interest has not yet been reached.
 */
export interface INavigable<T = any> {
	navigate: (position: IStreamPosition<T>) => T
}

/**
 * An interface for specifying a presence of a `.rewind` method.
 * It is intended for going to the beginning (in sequences). Returns
 * the new current element of the sequence.
 */
export interface IRewindable<T = any> {
	rewind: () => T
}

/**
 * An `IStream`-specific interface. Specifies whether
 * or not the current element (`.curr`) is the first one
 * in the `IStream` or not.
 */
export interface IIsCurrStartable {
	isCurrStart: () => boolean
}

/**
 * An interface for `n`-position lookahead inside an
 * `IStream`. Permits usage of finite-state machines
 * to match patterns inside `IStream`s.
 */
export interface IPeekable<T = any> {
	peek: (n: number) => T
}

/**
 * An interface for the `readonly .resource?: IOwnedStream`
 * property that is intended to signal ownership of output of a
 * given `IOwnedStream`. A single `IOwnedStream` may be used by
 * various `IResourceful` objects.
 */
export interface IResourceful {
	readonly resource?: IOwnedStream
}

/**
 * This is a type for representing entities that are
 * `IStateHaving<T>`, as well as `IStateSettable`
 */
export type IStateful<T extends Summat = Summat> = IStateHaving<T> &
	IStateSettable

/**
 * An interface for representing the library's primary data structure - a Stream.
 * `IStream`s are used throughout to represent lazy element-by-element
 * transformations of input data. Compositions of `IStream`s (via `ICompositeStream`s
 * and "chooser"s - `IStreamChooser`s) can form parser-functions that, themselves,
 * behave the same way as if the user had written the entire parser manually.
 *
 * The greatest benefit of the library for any application employing a parser
 * is precisely this - the ability of `IStream`s to represent simple,
 * granular operations allows one to make extremely simple, highly maintainable
 * and modular code.
 *
 * The library also boasts a large collection of `IStream` implementations
 * for a variety of different purposes.
 *
 * The `.isEnd: boolean` property specifies whether or not the `IStream` in question
 * has already been finished. The `.curr: T` represents the current element.
 * The `.isStart: boolean` represents whether the `IStream` has already been
 * started or not, `.next: () => void` moves the `IStream` one element forward,
 * and the `isCurrEnd: () => boolean` specifies whether or not the current
 * item (`.curr: T`) is the last in the `IStream`.
 *
 * (Note that `.isEnd == true` REQUIRES that the last call to `.isCurrEnd()`
 * to have been `true` as well, the same, however, does not always hold.
 * Iterating through the __very last__ element from the very first 
 * requires that `.isCurrEnd() == true` and `.isEnd == false`).
 */
export type IStream<T = any> = Partial<INavigable<T>> &
	Partial<IFinishable<T>> &
	Partial<IRewindable<T>> &
	Partial<IStateHaving> &
	Partial<IInitializable> &
	Partial<IIsCurrStartable> &
	Partial<IPeekable<T>> &
	Partial<IResourceful> &
	Partial<IPrevable> &
	Partial<IPosed<number>> &
	Partial<Iterable<T>> &
	ICopiable &
	IInitializable & {
		readonly curr: T
		readonly isEnd: boolean
		readonly isStart: boolean
		isCurrEnd: () => boolean
		next: () => void
	}

/**
 * This is an `IStream<T>` that is iterable backwards (`IPrevable`)
 */
export type IPrevableStream<T = any> = IStream<T> & IPrevable

/**
 * This is an `IStream<T>` that is `IPeekable<T>`
 */
export type IPeekableStream<T = any> = IStream<T> & IPeekable<T>

/**
 * This is an `IStream<T>` that is also `IResourceful`
 */
export type IResourcefulStream<T = any> = IStream<T> & IResourceful

/**
 * This is an `IStream<T>` that is also `IStateful`, as well as `IStateSettable`
 */
export type IStatefulStream<T = any> = IStream<T> & IStateful<IParseState>

/**
 * This is an `IStream<T>`, that is also `IPosed<numer>`.
 * Here `.pos: number` is used to track current item's numerical
 * position.
 */
export type IPositionStream<T = any> = IPosed<number> & IStream<T>

/**
 * This is a function representing a change in the `.curr: T`
 * [one that calls `.prev()/next()` underneath].
 */
export type IChange<T = any> = (input: IPrevableStream<T>) => T

/**
 * This is an `IStream<T>` that is also `Iterable<T>`
*/
export type IIterableStream<T = any> = IStream<T> & Iterable<T>

export type * from "../modules/Stream/interfaces/CompositeStream.js"
export type * from "../modules/Stream/interfaces/HandlerStream.js"
export type * from "../modules/Stream/interfaces/IndexStream.js"
export type * from "../modules/Stream/interfaces/InputStream.js"
export type * from "../modules/Stream/interfaces/LimitStream.js"
export type * from "../modules/Stream/interfaces/MarkerStream.js"
export type * from "../modules/Stream/interfaces/OwnedStream.js"
export type * from "../modules/Stream/interfaces/PeekStream.js"
export type * from "../modules/Stream/interfaces/SingletonStream.js"
export type * from "../modules/Stream/interfaces/StreamPosition.js"

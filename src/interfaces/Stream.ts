import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IOwnedStream,
	IParseState,
	IResourceSettable,
	IStateHaving,
	IStateSettable,
	ITableHandler
} from "../interfaces.js"
import type { IStreamStep } from "../modules/Stream/interfaces/StreamPosition.js"

/**
 * An interface for specifying a presence of a `.finish` method.
 * It is intended for going to the end (in sequences). Returns the
 * new current element of the sequence.
 */
export interface IFinishable<T = any> {
	finish(): T
}

/**
 * An interface for specifying a presence of a `.navigate(position: PosType) => T`.
 * Intended to be used with `IStream`. Accepts an `IStreamPosition<T>`, at which the stop must
 * be made. The position is signalled either as finite-relative (`number`), or predicate-relative
 * (`IStreamPositionPredicate<T>`). In the latter case, `false` usually means that the place of
 * interest has not yet been reached.
 */
export interface INavigable<T = any, PosType = IStreamStep<T>> {
	navigate(position: PosType): T
}

/**
 * An interface for `n`-position lookahead inside an
 * `IStream`. Permits usage of finite-state machines
 * to match patterns inside `IStream`s.
 */
export interface IPeekable<T = any> {
	peek(n: number): T
	hasPeek(n: number): boolean
	toPeek(n: number): void
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
 * is precisely this - the ability of `IStream`s to represent primitive,
 * granular operations allows one to make extremely simple, highly maintainable
 * and modular code.
 *
 * The library also boasts a large collection of `IStream` implementations
 * for a variety of different purposes.
 *
 * The `.isEnd: boolean` property specifies whether or not the `IStream` in question
 * has already been finished. The `.curr: T` represents the current element.
 * The `.next: () => void` moves the `IStream` one element forward,
 * and the `isCurrEnd: () => boolean` specifies whether or not the current
 * item (`.curr: T`) is the last in the `IStream`.
 *
 * (Note that `.isEnd == true` REQUIRES that the last call to `.isCurrEnd()`
 * to have been `true` as well, the same, however, does not always hold.
 * Iterating through the __very last__ element from the very first
 * requires that `.isCurrEnd() == true` and `.isEnd == false`).
 */
export interface IStream<T = any> {
	readonly curr: T
	readonly isEnd: boolean
	isCurrEnd(): boolean
	next(): void
}

/**
 * This is an `IStream<T>` that is `IPeekable<T>`
 */
export type IPeekableStream<T = any> = IStream<T> & IPeekable<T>

/**
 * This is an `IStream<T>` that is also `IResourceful`
 */
export type IResourcefulStream<T = any> = IStream<T> &
	IResourceful &
	IResourceSettable<IOwnedStream>

/**
 * This is an `IStream<T>` that is also `IStateful`, as well as `IStateSettable`
 */
export type IStatefulStream<T = any> = IStream<T> & IStateful<IParseState>

/**
 * This is an `IStream<T>`, that is also `IPosed<numer>`.
 * Here `.pos: number` is used to track current item's numerical
 * position.
 */
export type IPositionStream<T = any> = IPosed & IStream<T>

/**
 * This is an `IStream<T>` that is also `Iterable<T>`
 */
export type IIterableStream<T = any> = IStream<T> & Iterable<T>

/**
 * This is a type for representing functions returning `IStream`-based generators,
 * and supporting (optional) `ITableHandler`-passing (intended to be used in
 * the same contexts as them).
 */
export type IStreamGenerator<T = any, Out = any> = (
	stream: IIterableStream<T>,
	parentMap?: ITableHandler<IIterableStream<T>>
) => Generator<Out>

/**
 * The interface for objects with a `readonly .pos: number`.
 */
export interface IPosed {
	readonly pos: number
}

export type * from "../modules/Stream/interfaces/AccumulatorStream.js"
export type * from "../modules/Stream/interfaces/CommonStream.js"
export type * from "../modules/Stream/interfaces/CompositeStream.js"
export type * from "../modules/Stream/interfaces/DepthMarkStream.js"
export type * from "../modules/Stream/interfaces/HandlerStream.js"
export type * from "../modules/Stream/interfaces/IndexStream.js"
export type * from "../modules/Stream/interfaces/InputStream.js"
export type * from "../modules/Stream/interfaces/LimitStream.js"
export type * from "../modules/Stream/interfaces/Locator.js"
export type * from "../modules/Stream/interfaces/MarkerStream.js"
export type * from "../modules/Stream/interfaces/OwnedStream.js"
export type * from "../modules/Stream/interfaces/PeekStream.js"
export type * from "../modules/Stream/interfaces/ProxyStream.js"
export type * from "../modules/Stream/interfaces/RenewerStream.js"
export type * from "../modules/Stream/interfaces/SingletonStream.js"
export type * from "../modules/Stream/interfaces/StorageStream.js"
export type * from "../modules/Stream/interfaces/StreamPosition.js"
export type * from "../modules/Stream/interfaces/ValidatorStream.js"

import { functional } from "@hgargg-0710/one"
import assert from "assert"
import { asSteps } from "src/modules/Stream/utils/Step.js"
import type {
	IGettable,
	ILinkedStream,
	IOwnedStream,
	IPeekableStream,
	ISingletonNodeType,
	IStream,
	ITypeCheckable
} from "../interfaces.js"
import {
	ConcatStream,
	FiniteStream,
	HandlerStream,
	InterleaveStream,
	LimitDepthMarks,
	LimitStream,
	LoopStream,
	RecursiveLimitStream,
	SingletonStream
} from "../objects/Stream.js"
import { skip } from "../utils/Stream.js"

const { negate } = functional

export function autoNextLimits(n: number) {
	return function <T = any>(limits: LimitStream.Limits<T>) {
		return limits.wrapLongAs((longAs) => (input: IStream<T>) => {
			const steps = asSteps(input, longAs)
			if (steps === 0) {
				skip(input, n)
				return false
			}
			return steps
		})
	}
}

export function AutoNextRecursiveLimitStream(n: number) {
	const limitWrapper = autoNextLimits(n)
	return function <T = any>(
		depthMarks: LimitDepthMarks,
		limits: LimitStream.Limits<T>
	) {
		return RecursiveLimitStream(depthMarks, limitWrapper(limits))
	}
}

export function AutoNextLimitStream(n: number) {
	const limitWrapper = autoNextLimits(n)
	return function <T = any>(limits: LimitStream.Limits<T>) {
		return LimitStream(limitWrapper(limits))
	}
}

export const PastEndStream = AutoNextLimitStream(1)

export const EndBracketStream = AutoNextLimitStream(2)

export const RecursiveBracketStream = AutoNextRecursiveLimitStream(2)

/**
 * This is a `SingletonStream` that, as its `.curr: W`
 * has the result of the call to `new wrapperClass(input.curr)`.
 * Perfect for simple wrapping classes.
 */
export function SingletonWrapperStream<T = any, W = any>(
	wrapperClass: new (value: T) => W
) {
	return SingletonStream((input: IStream<T>) => new wrapperClass(input.curr))
}

/**
 * This is a `SingletonStream` with the value of `.curr`
 * being the result of `new tokenClass()`.
 */
export function TokenStream<T = any>(tokenClass: new () => T) {
	return SingletonStream(() => new tokenClass())
}

export function CachedTokenStream(tokenClass: ISingletonNodeType) {
	return SingletonStream(() => tokenClass.make())
}

/**
 * Returns a predicate that checks whether `input.curr === value`.
 */
export function isCurr<T = any>(value: T) {
	return (input: IStream<T>) => input.curr === value
}

export function isPeek(n: number) {
	assert(n >= 0)
	return <T = any>(value: T) =>
		(input: IPeekableStream<T>) =>
			input.peek(n) === value
}

export function isNotPeek(n: number) {
	const isIt = isPeek(n)
	return <T = any>(value: T): ((input: IPeekableStream<T>) => boolean) =>
		negate(isIt(value))
}

export const isNext = isPeek(1)

export const isNotNext = isNotPeek(1)

export function isNotNonEscapedNext(value: string) {
	const isNotValueNext = isNotNext(value)
	const isNotOneAfterNext = isNotPeek(2)(value)
	return (input: IPeekableStream<string>) =>
		input.curr === "\\"
			? 1 + Number(isNotOneAfterNext(input))
			: isNotValueNext(input)
}

/**
 * This is a `SingletonStream` that expects a
 * `wrapper` class and `withConsumable` function
 * (normally a `consumable(...)`-result), and
 * produces as its `.curr` value the result of the
 * call to `new wrapper(withConsumable(input).get())`.
 *
 * The practical significance of the class stems from
 * this being a very common operation with `SourceBuilder`s
 * and `ArrayBuilder`s for creation of strings/arrays
 * of elements of the underlying `input`-stream, that
 * would then be used by respective `INode`-classes
 * to represent data of the final generated tree.
 */
export function CollectionStream<W = any, V = any>(
	wrapper: new (value: V) => W,
	withConsumable: (input: Iterable<any>) => IGettable<V>
) {
	return SingletonStream(
		(input: IOwnedStream & Iterable<any>) =>
			new wrapper(withConsumable(input).get())
	)
}

/**
 * This is a function for creation of a "default chooser",
 * the most primitive chooser humanely achievable - a function
 * that returns uninitialized `[streamFactory()]` and takes no argument.
 *
 * Useful for cutting down boilerplate and as a pattern.
 */
export function DefaultChooser<T = any, K extends IOwnedStream = IOwnedStream>(
	streamFactory: (input?: K) => ILinkedStream<T>
) {
	return () => [streamFactory()]
}

export const EscapedStream = HandlerStream((stream: IOwnedStream<string>) => {
	if (stream.curr === "\\") stream.next()
	return stream.curr
})

export function DelimitedStream<T = any, E = any>(
	getDelimiter: () => T,
	endProvider: (ends: E) => [T[], T[]]
) {
	return function (ends: E, stream: IStream<T>) {
		const [pre, post] = endProvider(ends)
		return new ConcatStream(
			new FiniteStream(...pre),
			new InterleaveStream(stream, new LoopStream(getDelimiter)),
			new FiniteStream(...post)
		)
	}
}

export function isCurrKind<T = any>(kind: ITypeCheckable<T>) {
	return (input: IOwnedStream<T>) => kind.is(input.curr)
}

export function peekKind(n: number) {
	return <T = any>(kind: ITypeCheckable<T>) =>
		(input: IPeekableStream<T>) =>
			kind.is(input.peek(n))
}

export function isNotPeekKind(n: number) {
	const isKind = peekKind(n)
	return <T = any>(
		kind: ITypeCheckable<T>
	): ((input: IPeekableStream<T>) => boolean) => negate(isKind(kind))
}

export const isNotNextKind = isNotPeekKind(1)

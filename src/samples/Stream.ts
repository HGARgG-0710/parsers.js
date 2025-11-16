import type {
	IGettable,
	ILinkedStream,
	IOwnedStream,
	IPeekableStream,
	ISingletonNodeType,
	IStepPredicate,
	IStream
} from "../interfaces.js"
import {
	HandlerStream,
	LimitStream,
	SingletonStream
} from "../objects/Stream.js"

/**
 * This is a `LimitStream` that lasts upto the character at which `until`
 * becomes true, and then skips it (unlike common `LimitStream`). Very useful
 * for `(...)`-type bracketed expressions.
 */
export function EndBracketStream<T = any>(
	from: IStepPredicate<IStream<T>>,
	until?: IStepPredicate<IStream<T>>
) {
	;[from, until] = LimitStream.ensureLimitsPair(from, until)
	return LimitStream(from, (input: IStream<T>) => {
		const isEnd = until(input)
		if (LimitStream.testUntilPredicateResult(isEnd)) {
			input.next()
			return false
		}
		return isEnd || true
	})
}

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

export function isNonEscaped(value: string) {
	return (input: IPeekableStream<string>) =>
		input.curr === "\\" ? 1 : input.curr === value
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
	if (stream.curr == "\\") stream.next()
	return stream.curr
})

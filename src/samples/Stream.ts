import { LimitStream, SingletonStream } from "../objects/Stream.js"
import type {
	IGettable,
	ILinkedStream,
	IOwnedStream,
	IPredicatePosition,
	IStream
} from "../interfaces.js"

/**
 * This is a `LimitStream` that lasts upto the character at which `until`
 * becomes true, and then skips it (unlike common `LimitStream`). Very useful
 * for `(...)`-type bracketed expressions.
 */
export function EndBracketStream<T = any>(
	from: IPredicatePosition<IStream<T>>,
	until?: IPredicatePosition<IStream<T>>
) {
	;[from, until] = LimitStream.ensurePredicatePair(from, until)
	return LimitStream(from, (input: IStream<T>) => {
		const isEnd = until(input)
		if (isEnd) input.next()
		return !isEnd
	})
}

/**
 * This is a `SingletonStream` that, as its `.curr: W`
 * has the result of the call to `new wrapperClass(input.curr)`.
 * Perfect for simple wrapping classes.
 */
export function WrapperStream<T = any, W = any>(
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

/**
 * Returns a predicate that checks whether `input.curr === value`.
 */
export function isCurr<T = any>(value: T) {
	return (input: IStream<T>) => input.curr === value
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

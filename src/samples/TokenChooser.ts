import type { IMatchResult, IPeekStream } from "../interfaces.js"
import type { Regex } from "../objects.js"

/**
 * Returns a function for performing a linear walk-through
 * the given `choices` with `[pattern, chooser]` being the
 * current element, and checking whether `pattern.matchAt(stream)`.
 *
 * The first match to succeed gets to have `chooser(stream)`
 * returned from the closure returned by `TokenChooser`.
 *
 * If no matches can be found among the provided options,
 * `defaultHandler(stream)` is returned otherwise.
 *
 * Note, also, that `defaultHandler` can be used to invoke
 * errors.
 *
 * This sample function is perfect for creation of `Regex`-based
 * tokenizer-chooser(s), and handlers of simple enough patterns
 * that do not require large quantities of dynamic/conditional
 * logic. The `stream` is, however, required to be an `IPeekStream`,
 * due to the way in which the `Regex.prototype.matchAt` method
 * signature.
 */
export function TokenChooser<In = any, Out = any, Default = void>(
	choices: Iterable<[Regex, (read: IMatchResult<In>) => Out]>,
	defaultHandler: (stream: IPeekStream<In>) => Default,
) {
	return function (stream: IPeekStream<In>) {
		for (const [pattern, preChooser] of choices) {
			const matched = pattern.matchAt(stream)
			if (matched) return preChooser(matched)
		}
		return defaultHandler(stream)
	}
}

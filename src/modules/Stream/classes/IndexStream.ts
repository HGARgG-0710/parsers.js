import { LineIndex } from "../../../classes/Position.js"
import type { ILineIndex } from "../../../interfaces.js"
import type { IOwnedStream, IPrevable } from "../../../interfaces/Stream.js"
import type { IIndexStream } from "../interfaces/IndexStream.js"
import { IdentityStream, IdentityStreamAnnotation } from "./IdentityStream.js"

class IndexStreamAnnotation<T = any>
	extends IdentityStreamAnnotation<T>
	implements IIndexStream<T>, IPrevable
{
	readonly lineIndex: ILineIndex

	setNewlinePredicate(isNewline: () => boolean) {
		return this
	}
}

function BuildIndexStream<T = any>() {
	return class
		extends IdentityStream.generic!<T, []>()
		implements IIndexStream<T>, IPrevable
	{
		private isNewline: () => boolean

		next() {
			super.next()
			this.lineIndex[this.isNewline() ? "nextChar" : "nextLine"]()
		}

		prev() {
			super.prev()
			this.lineIndex.prevChar!()
		}

		setNewlinePredicate(isNewline: () => boolean) {
			this.isNewline = isNewline
			return this
		}

		constructor(
			resource?: IOwnedStream<T>,
			public readonly lineIndex: ILineIndex = new LineIndex()
		) {
			super(resource)
		}
	} as typeof IndexStreamAnnotation<T>
}

let indexStream: typeof IndexStreamAnnotation | null = null

function PreIndexStream<T = any>(): typeof IndexStreamAnnotation<T> {
	return indexStream
		? indexStream
		: (indexStream = BuildIndexStream<T>() as typeof IndexStreamAnnotation)
}

/**
 * This is a class implementing `IIndexStream<T>` and `IPrevable`.
 * It extends `IdentityStream<T>`.
 *
 * The stream keeps track of a `public readonly .lineIndex: ILineIndex`,
 * which can be used to track the "character-newline" position inside
 * the underlying `IOwnedStream`.
 * It uses the given predicate `isNewline` [which is intended to use `this`],
 * to analyze whether or not to consider the current element `T` of `.resource`
 * to be a "newline" or not. In case that the predicate returns `true`,
 * it calls `this.lineIndex.nextLine()`, otherwise - `this.lineIndex.nextChar()`.
 *
 * The Stream is useful for error diagnostics in `IStream`-based input validators,
 * and/or robust parsers.
 */
export function IndexStream<T = any>(isNewline: () => boolean) {
	const indexStream = PreIndexStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new indexStream().setNewlinePredicate(isNewline).init(resource)
	}
}

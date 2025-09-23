import { Pools } from "../../../../main.js"
import { ObjectPool } from "../../../classes.js"
import { LineIndex } from "../../../classes/Position.js"
import type { ILineIndex } from "../../../interfaces.js"
import type { IOwnedStream } from "../../../interfaces/Stream.js"
import type {
	IIndexStream,
	INewlinePredicate
} from "../interfaces/IndexStream.js"
import { IdentityStream } from "./IdentityStream.js"

function BuildIndexStream<T = any>(isNewline: INewlinePredicate<T>) {
	return class IndexStream
		extends IdentityStream.generic!<T, []>()
		implements IIndexStream<T>
	{
		static readonly pool = Pools.Stream.add(new ObjectPool(IndexStream))

		private isNewline: INewlinePredicate<T>

		private lineIndexTransition() {
			if (this.isNewline(this.resource!)) this.lineIndex.nextLine()
			else this.lineIndex.nextChar()
		}

		get pool() {
			return IndexStream.pool
		}

		next() {
			super.next()
			this.lineIndexTransition()
		}

		constructor(
			resource?: IOwnedStream<T>,
			public readonly lineIndex: ILineIndex = new LineIndex()
		) {
			super()
			this.isNewline = isNewline.bind(this)
			this.init(resource)
		}
	}
}

/**
 * This is a class implementing `IIndexStream<T>`.
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
export function IndexStream<T = any>(isNewline: INewlinePredicate<T>) {
	const indexStream = BuildIndexStream<T>(isNewline)
	return function (resource?: IOwnedStream<T>) {
		return indexStream.pool.create(resource)
	}
}

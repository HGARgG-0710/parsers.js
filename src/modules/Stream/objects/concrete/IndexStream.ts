import { Pools } from "../../../../../main.js"
import type { ILineIndex, IPoolKeeping } from "../../../../interfaces.js"
import type {
	ICommonStream,
	IOwnedStream
} from "../../../../interfaces/Stream.js"
import { ObjectPool } from "../../../../objects.js"
import type {
	IIndexStream,
	INewlinePredicate
} from "../../interfaces/IndexStream.js"
import { IdentityStream } from "./IdentityStream.js"

function BuildIndexStream<T = any>(
	isNewline: INewlinePredicate<T>,
	lineIndexMaker: () => ILineIndex
): IPoolKeeping<IIndexStream<T> & ICommonStream<T>> {
	return class IndexStream
		extends IdentityStream<T, []>
		implements IIndexStream<T>
	{
		static override readonly pool = Pools.Stream.add(
			new ObjectPool(IndexStream)
		)

		readonly lineIndex: ILineIndex
		private isNewline: INewlinePredicate<T>

		private lineIndexTransition() {
			if (this.isNewline(this.resource!)) this.lineIndex.nextLine()
			else this.lineIndex.nextChar()
		}

		override baseInit(): void {
			this.lineIndex.renew()
		}

		override next() {
			super.next()
			this.lineIndexTransition()
		}

		constructor(resource?: IOwnedStream<T>) {
			super()
			this.isNewline = isNewline
			this.lineIndex = lineIndexMaker()
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
	return function (lineIndexMaker: () => ILineIndex) {
		const indexStream = BuildIndexStream<T>(isNewline, lineIndexMaker)

		function I(
			resource?: IOwnedStream<T>
		): IIndexStream<T> & ICommonStream<T> {
			return indexStream.pool.create(resource)
		}

		I.pool = indexStream.pool

		return I
	}
}

import { LineIndex } from "../../../classes/Position.js"
import type { ILineIndex } from "../../../interfaces.js"
import type { IOwnedStream, IPrevable } from "../../../interfaces/Stream.js"
import type { IIndexStream } from "../interfaces/IndexStream.js"
import { WrapperStream, WrapperStreamAnnotation } from "./WrapperStream.js"

class IndexStreamAnnotation<T = any>
	extends WrapperStreamAnnotation<T>
	implements IIndexStream<T>, IPrevable
{
	readonly lineIndex: ILineIndex

	setNewlinePredicate(isNewline: () => boolean) {
		return this
	}
}

function BuildIndexStream<T = any>() {
	return class
		extends WrapperStream.generic!<T, []>()
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

export function IndexStream<T = any>(isNewline: () => boolean) {
	const indexStream = PreIndexStream<T>()
	return function (resource?: IOwnedStream<T>) {
		return new indexStream().setNewlinePredicate(isNewline).init(resource)
	}
}

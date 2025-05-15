import type { ILineIndex, IOwnedStream } from "../../interfaces/Stream.js"
import { maybeInit } from "../../utils.js"
import type { IIndexStream } from "../interfaces/IndexStream.js"
import { LineIndex } from "./Position.js"
import { WrapperStream } from "./WrapperStream.js"

class _IndexStream<Type = any>
	extends WrapperStream<Type>
	implements IIndexStream<Type>
{
	private isNewline: () => boolean

	next() {
		const curr = super.next()
		this.lineIndex[this.isNewline() ? "nextChar" : "nextLine"]()
		return curr
	}

	setNewlinePredicate(isNewline: () => boolean) {
		this.isNewline = isNewline
		return this
	}

	constructor(
		resource?: IOwnedStream<Type>,
		public readonly lineIndex: ILineIndex = new LineIndex()
	) {
		super(resource)
	}
}

export function IndexStream<Type = any>(isNewline: () => boolean) {
	return function (resource?: IOwnedStream<Type>) {
		return maybeInit(
			new _IndexStream().setNewlinePredicate(isNewline),
			resource
		)
	}
}

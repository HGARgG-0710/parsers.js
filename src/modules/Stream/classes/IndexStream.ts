import type {
	ILineIndex,
	IOwnedStream,
	IPrevable
} from "../../../interfaces/Stream.js"
import type { IIndexStream } from "../interfaces/IndexStream.js"
import { LineIndex } from "./Position.js"
import { WrapperStream } from "./WrapperStream.js"

class _IndexStream<Type = any>
	extends WrapperStream<Type>
	implements IIndexStream<Type>, IPrevable
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
		resource?: IOwnedStream<Type>,
		public readonly lineIndex: ILineIndex = new LineIndex()
	) {
		super(resource)
	}
}

export function IndexStream<Type = any>(isNewline: () => boolean) {
	return function (resource?: IOwnedStream<Type>) {
		return new _IndexStream().setNewlinePredicate(isNewline).init(resource)
	}
}

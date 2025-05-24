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
	implements IIndexStream<Type>, IPrevable<Type>
{
	private isNewline: () => boolean

	next() {
		const curr = super.next()
		this.lineIndex[this.isNewline() ? "nextChar" : "nextLine"]()
		return curr
	}

	prev(): Type {
		const curr = super.prev()
		this.lineIndex.prevChar!()
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
		return new _IndexStream().setNewlinePredicate(isNewline).init(resource)
	}
}

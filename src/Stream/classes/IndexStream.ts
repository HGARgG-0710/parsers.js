import type { ILineIndex, IOwnedStream } from "../../interfaces/Stream.js"
import type { IIndexStream } from "../interfaces/IndexStream.js"
import { LineIndex } from "./Position.js"
import { WrapperStream } from "./WrapperStream.js"

export function IndexStream<Type = any>(
	isNewline: (x: IOwnedStream<Type>) => boolean
): new (resource?: IOwnedStream<Type>) => IIndexStream<Type> {
	return class extends WrapperStream<Type> implements IIndexStream<Type> {
		next() {
			const curr = super.next()
			this.lineIndex[isNewline(this) ? "nextChar" : "nextLine"]()
			return curr
		}

		constructor(
			resource?: IOwnedStream<Type>,
			public readonly lineIndex: ILineIndex = new LineIndex()
		) {
			super(resource)
		}
	}
}

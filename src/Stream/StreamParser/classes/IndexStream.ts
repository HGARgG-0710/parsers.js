import type { IEndableStream, ILineIndex } from "../../interfaces.js"

import type {
	IIndexStream,
	IIndexStreamConstructor,
	INewlinePredicate
} from "../interfaces/IndexStream.js"

import { LineIndex } from "../../Position/classes.js"
import { StreamParser } from "../classes.js"
import { Autocache } from "../../../internal/Autocache.js"
import { BasicHash } from "../../../HashMap/classes.js"
import { MapInternal } from "../../../HashMap/InternalHash/classes.js"

const indexStreamHandler = (isNewline: INewlinePredicate) =>
	function (this: IIndexStream, stream: IEndableStream<string>) {
		this.lineIndex[isNewline(stream) ? "nextChar" : "nextLine"]()
		return stream.curr
	}

const __IndexStream = (isNewline: INewlinePredicate) =>
	StreamParser<string>(indexStreamHandler(isNewline))(false, false)

function makeIndexStream(
	isNewline: INewlinePredicate
): IIndexStreamConstructor {
	return class extends __IndexStream(isNewline) {
		get buffer() {
			return this.value.buffer
		}

		set pos(newPos) {
			this.value.pos = newPos
		}

		get pos() {
			return this.value.pos
		}

		constructor(
			value?: IEndableStream<string>,
			public readonly lineIndex: ILineIndex = new LineIndex()
		) {
			super(value)
		}
	}
}

export const IndexStream = new Autocache(
	new BasicHash(new MapInternal()),
	makeIndexStream
) as unknown as new (isNewline: INewlinePredicate) => IIndexStreamConstructor

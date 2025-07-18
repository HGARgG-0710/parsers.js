import { SourceBuilder } from "../../../classes.js"
import { ContentNode } from "../../../classes/Node.js"
import { LimitStream, SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { consume } from "../../../utils/Stream.js"
import { bail, ErrorCode } from "../Errors.js"

const unicodeCharBuilder = new SourceBuilder()

const UnicodeChar = ContentNode<string, string>("unicode-char")

const UnicodeLimitStream = LimitStream((input) => input.curr === "{")

const UnicodeCharStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) => {
		unicodeCharBuilder.clear()
		return new UnicodeChar(consume(input, unicodeCharBuilder).get())
	}
)

function HandleUnicodeNumber() {
	return [UnicodeCharStream(), UnicodeLimitStream()]
}

export function HandleUnicode(input: IOwnedStream<string>) {
	input.next() // u
	if (!(input.curr === "{")) bail(ErrorCode.MissingCharacter)
	input.next() // {
	return HandleUnicodeNumber()
}

import { ContentNode } from "../../../classes/Node.js"
import { SourceBuilder } from "../../../classes/SourceBuilder.js"
import { LimitStream, SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { consumable } from "../../../utils/Stream.js"
import { expect } from "../Errors.js"

const withUnicodeCharBuilder = consumable(new SourceBuilder())

const UnicodeChar = ContentNode<string, string>("unicode-char")

const expectOpBrack = expect("{")

const UnicodeLimitStream = LimitStream((input) => input.curr === "{")

const UnicodeCharStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) =>
		new UnicodeChar(withUnicodeCharBuilder(input).get())
)

function HandleUnicodeNumber() {
	return [UnicodeCharStream(), UnicodeLimitStream()]
}

export function HandleUnicode(input: IOwnedStream<string>) {
	input.next() // u
	expectOpBrack(input) // '{' is `.curr`
	input.next() // {
	return HandleUnicodeNumber()
}

import { ContentNode } from "../../../objects/Node.js"
import { SourceBuilder } from "../../../objects/SourceBuilder.js"
import type { IOwnedStream } from "../../../interfaces.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../../samples/Stream.js"
import { consumable } from "../../../utils/Stream.js"
import { expect } from "../Errors.js"

const UnicodeChar = ContentNode<string, string>("unicode-char")

const expectOpBrack = expect("{")

const UnicodeLimitStream = EndBracketStream(isCurr("}"))

const UnicodeCharStream = CollectionStream(
	UnicodeChar,
	consumable(new SourceBuilder())
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

import type { IOwnedStream } from "../../../interfaces.js"
import { expect } from "../../../objects/Error.js"
import { SourceBuilder } from "../../../objects/SourceBuilder.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../../samples/Stream.js"
import { consumable } from "../../../utils/Stream.js"
import { UnicodeChar } from "../Nodes.js"

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
	expectOpBrack(input)
	input.next() // {
	return HandleUnicodeNumber()
}

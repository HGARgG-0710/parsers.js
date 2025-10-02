import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Word } from "../Nodes.js"

const WordStream = TokenStream(Word)

export function HandleWord(input: IOwnedStream<string>) {
	input.next() // w
	return WordStream()
}

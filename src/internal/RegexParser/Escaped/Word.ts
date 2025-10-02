import { TokenNode } from "../../../objects/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Word = TokenNode("word")
const WordStream = TokenStream(Word)

export function HandleWord(input: IOwnedStream<string>) {
	input.next() // w
	return WordStream()
}

import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { Word } from "../Nodes.js"

const WordStream = CachedTokenStream(Word)

export function HandleWord(input: IOwnedStream<string>) {
	input.next() // w
	return WordStream()
}

import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Word = TokenNode("word")
const WordStream = SingletonStream(() => new Word())

export function HandleWord(input: IOwnedStream<string>) {
	input.next() // w
	return WordStream()
}

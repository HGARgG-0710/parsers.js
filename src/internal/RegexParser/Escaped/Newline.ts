import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Newline = TokenNode("newline")
const NewlineStream = SingletonStream(() => new Newline())

export function HandleNewline(input: IOwnedStream<string>) {
	input.next() // n
	return NewlineStream()
}

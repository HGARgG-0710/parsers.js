import { TokenNode } from "../../../classes/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Newline = TokenNode("newline")
const NewlineStream = TokenStream(Newline)

export function HandleNewline(input: IOwnedStream<string>) {
	input.next() // n
	return NewlineStream()
}

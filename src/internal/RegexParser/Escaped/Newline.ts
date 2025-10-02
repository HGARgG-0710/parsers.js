import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Newline } from "../Nodes.js"

const NewlineStream = TokenStream(Newline)

export function HandleNewline(input: IOwnedStream<string>) {
	input.next() // n
	return NewlineStream()
}

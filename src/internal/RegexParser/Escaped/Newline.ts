import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { Newline } from "../Nodes.js"

const NewlineStream = CachedTokenStream(Newline)

export function HandleNewline(input: IOwnedStream<string>) {
	input.next() // n
	return NewlineStream()
}

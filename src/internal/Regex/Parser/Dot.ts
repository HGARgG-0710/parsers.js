import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { AnyChar } from "./Nodes.js"

const AnyCharStream = CachedTokenStream(AnyChar)

function handleDot(input: IOwnedStream<string>) {
	input.next() // .
	return [AnyCharStream()]
}

export const maybeDot = { ".": handleDot }

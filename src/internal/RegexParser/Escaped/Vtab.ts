import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { VTab } from "../Nodes.js"

const VTabStream = CachedTokenStream(VTab)

export function HandleVTab(input: IOwnedStream<string>) {
	input.next() // v
	return VTabStream()
}

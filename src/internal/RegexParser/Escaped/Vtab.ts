import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { VTab } from "../Nodes.js"

const VTabStream = TokenStream(VTab)

export function HandleVTab(input: IOwnedStream<string>) {
	input.next() // v
	return VTabStream()
}

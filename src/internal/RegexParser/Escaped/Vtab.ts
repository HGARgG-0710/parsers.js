import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { VTab } from "../Nodes.js"

const VtabStream = TokenStream(VTab)

export function HandleVerticalTab(input: IOwnedStream<string>) {
	input.next() // v
	return VtabStream()
}

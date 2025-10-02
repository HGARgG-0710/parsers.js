import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Vtab } from "../Nodes.js"

const VtabStream = TokenStream(Vtab)

export function HandleVerticalTab(input: IOwnedStream<string>) {
	input.next() // v
	return VtabStream()
}

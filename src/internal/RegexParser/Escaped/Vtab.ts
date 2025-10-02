import { TokenNode } from "../../../objects/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Vtab = TokenNode("vtab")
const VtabStream = TokenStream(Vtab)

export function HandleVerticalTab(input: IOwnedStream<string>) {
	input.next() // v
	return VtabStream()
}

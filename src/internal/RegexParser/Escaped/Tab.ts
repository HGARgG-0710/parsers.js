import { TokenNode } from "../../../objects/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Tab = TokenNode("tab")
const TabStream = TokenStream(Tab)

export function HandleTab(input: IOwnedStream<string>) {
	input.next() // t
	return TabStream()
}

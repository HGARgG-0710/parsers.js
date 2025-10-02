import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Tab } from "../Nodes.js"

const TabStream = TokenStream(Tab)

export function HandleTab(input: IOwnedStream<string>) {
	input.next() // t
	return TabStream()
}

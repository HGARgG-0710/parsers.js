import type { IOwnedStream } from "../../../../interfaces.js"
import { CachedTokenStream } from "../../../../samples/Stream.js"
import { Tab } from "../Nodes.js"

const TabStream = CachedTokenStream(Tab)

export function HandleTab(input: IOwnedStream<string>) {
	input.next() // t
	return [TabStream()]
}

import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Tab = TokenNode("tab")
const TabStream = SingletonStream(() => new Tab())

export function HandleTab(input: IOwnedStream<string>) {
	input.next() // t
	return TabStream()
}

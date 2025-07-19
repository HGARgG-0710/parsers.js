import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Vtab = TokenNode("vtab")
const VtabStream = SingletonStream(() => new Vtab())

export function HandleVerticalTab(input: IOwnedStream<string>) {
	input.next() // v
	return VtabStream()
}

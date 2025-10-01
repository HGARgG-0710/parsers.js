import { TokenNode } from "../../../classes/Node.js"
import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"

const Space = TokenNode("space")
const SpaceStream = TokenStream(Space)

export function HandleSpace(input: IOwnedStream<string>) {
	input.next() // s
	return SpaceStream()
}

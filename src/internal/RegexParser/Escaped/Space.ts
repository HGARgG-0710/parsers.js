import type { IOwnedStream } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Space } from "../Nodes.js"

const SpaceStream = TokenStream(Space)

export function HandleSpace(input: IOwnedStream<string>) {
	input.next() // s
	return SpaceStream()
}

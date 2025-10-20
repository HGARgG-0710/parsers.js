import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { Space } from "../Nodes.js"

const SpaceStream = CachedTokenStream(Space)

export function HandleSpace(input: IOwnedStream<string>) {
	input.next() // s
	return SpaceStream()
}

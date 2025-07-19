import { TokenNode } from "../../../classes/Node.js"
import { SingletonStream } from "../../../classes/Stream.js"
import type { IOwnedStream } from "../../../interfaces.js"

const Space = TokenNode("space")
const SpaceStream = SingletonStream(() => new Space())

export function HandleSpace(input: IOwnedStream<string>) {
	input.next() // s
	return SpaceStream()
}

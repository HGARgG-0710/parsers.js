import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { FormFeed } from "../Nodes.js"

const FormFeedStream = CachedTokenStream(FormFeed)

export function HandleFormFeed(input: IOwnedStream<string>) {
	input.next() // f
	return [FormFeedStream()]
}

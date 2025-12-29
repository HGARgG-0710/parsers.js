import type { IOwnedStream } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
import { Temp } from "./Nodes.js"

const PipeStream = CachedTokenStream(Temp.Pipe)

function handlePipe(input: IOwnedStream<string>) {
	input.next() // |
	return [PipeStream()]
}

export const maybePipe = {
	"|": handlePipe
}

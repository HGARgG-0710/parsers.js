import type { array } from "@hgargg-0710/one"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { TokenStream } from "../../samples/Stream.js"
import { Pipe } from "./Nodes.js"

const PipeStream = TokenStream(Pipe)

function handlePipe(input: IOwnedStream<string>) {
	input.next() // |
	return [PipeStream()]
}

export const maybePipe: array.Pairs<string, IStreamChooser> = [
	["|", handlePipe]
]

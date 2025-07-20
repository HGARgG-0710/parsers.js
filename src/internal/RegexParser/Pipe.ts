import type { array } from "@hgargg-0710/one"
import { TokenNode } from "../../classes/Node.js"
import { SingletonStream } from "../../classes/Stream.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"

export const Pipe = TokenNode("pipe")
const PipeStream = SingletonStream(() => new Pipe())

function handlePipe(input: IOwnedStream<string>) {
	input.next() // |
	return PipeStream()
}

export const maybePipe: array.Pairs<string, IStreamChooser> = [
	["|", handlePipe]
]

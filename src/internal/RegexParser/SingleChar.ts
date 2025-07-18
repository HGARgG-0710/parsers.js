import { ContentNode } from "../../classes/Node.js"
import { SingletonStream } from "../../classes/Stream.js"
import type { IOwnedStream } from "../../interfaces.js"

export const SingleChar = ContentNode<string, string>("char")
export const SingleCharStream = SingletonStream(
	(input: IOwnedStream<string>) => new SingleChar(input.curr)
)

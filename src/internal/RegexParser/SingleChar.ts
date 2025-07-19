import { ContentNode } from "../../classes/Node.js"
import { SingletonStream } from "../../classes/Stream.js"
import type { IOwnedStream } from "../../interfaces.js"

const SingleChar = ContentNode<string, string>("char")
const SingleCharStream = SingletonStream(
	(input: IOwnedStream<string>) => new SingleChar(input.curr)
)

export const HandleSingleChar = () => SingleCharStream()

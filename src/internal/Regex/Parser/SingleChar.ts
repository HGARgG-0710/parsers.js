import type { IStream } from "../../../interfaces.js"
import { SingletonStream } from "../../../objects/Stream.js"
import { DefaultChooser } from "../../../samples/Stream.js"
import { SingleChar } from "./Nodes.js"

const SingleCharStream = SingletonStream((input: IStream<string>) =>
	SingleChar.make(input.curr)
)

export const HandleSingleChar = DefaultChooser(SingleCharStream)

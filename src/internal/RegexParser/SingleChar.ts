import { DefaultChooser, WrapperStream } from "../../samples/Stream.js"
import { SingleChar } from "./Nodes.js"

const SingleCharStream = WrapperStream(SingleChar)
export const HandleSingleChar = DefaultChooser(SingleCharStream)

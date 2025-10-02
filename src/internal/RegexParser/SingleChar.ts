import { ContentNode } from "../../objects/Node.js"
import { DefaultChooser, WrapperStream } from "../../samples/Stream.js"

const SingleChar = ContentNode<string, string>("char")
const SingleCharStream = WrapperStream(SingleChar)
export const HandleSingleChar = DefaultChooser(SingleCharStream)

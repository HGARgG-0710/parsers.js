import { DefaultChooser, SingletonWrapperStream } from "../../samples/Stream.js"
import { SingleChar } from "./Nodes.js"

const SingleCharStream = SingletonWrapperStream(SingleChar)
export const HandleSingleChar = DefaultChooser(SingleCharStream)

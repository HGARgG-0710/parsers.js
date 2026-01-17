import { CachedTokenStream, DefaultChooser } from "../../../samples/Stream.js"
import { AnyChar } from "./Nodes.js"

const AnyCharStream = CachedTokenStream(AnyChar)
const handleDot = DefaultChooser(AnyCharStream)
export const maybeDot = { ".": handleDot }

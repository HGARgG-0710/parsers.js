import { CachedTokenStream, DefaultChooser } from "../../../samples/Stream.js"
import { Temp } from "./Nodes.js"

const PipeStream = CachedTokenStream(Temp.Pipe)
const handlePipe = DefaultChooser(PipeStream)
export const maybePipe = { "|": handlePipe }

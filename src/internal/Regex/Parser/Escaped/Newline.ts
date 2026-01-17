import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Newline } from "../Nodes.js"

const NewlineStream = CachedTokenStream(Newline)
export const HandleNewline = DefaultChooser(NewlineStream)

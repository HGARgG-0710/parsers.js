import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { VTab } from "../Nodes.js"

const VTabStream = CachedTokenStream(VTab)
export const HandleVTab = DefaultChooser(VTabStream)

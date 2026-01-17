import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Tab } from "../Nodes.js"

const TabStream = CachedTokenStream(Tab)
export const HandleTab = DefaultChooser(TabStream)

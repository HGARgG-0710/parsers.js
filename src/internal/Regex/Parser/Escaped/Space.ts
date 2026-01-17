import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Space } from "../Nodes.js"

const SpaceStream = CachedTokenStream(Space)
export const HandleSpace = DefaultChooser(SpaceStream)

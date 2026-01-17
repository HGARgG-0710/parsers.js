import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { FormFeed } from "../Nodes.js"

const FormFeedStream = CachedTokenStream(FormFeed)
export const HandleFormFeed = DefaultChooser(FormFeedStream)

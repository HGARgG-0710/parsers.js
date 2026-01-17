import {
	CachedTokenStream,
	DefaultChooser
} from "../../../../samples/Stream.js"
import { Temp } from "../Nodes.js"
import { HandleRange } from "./Range.js"

const PlusStream = CachedTokenStream(Temp.Plus)
const StarStream = CachedTokenStream(Temp.Star)
const QMarkStream = CachedTokenStream(Temp.QMark)

const handlePlus = DefaultChooser(PlusStream)
const handleStar = DefaultChooser(StarStream)
const handleQmark = DefaultChooser(QMarkStream)

export const maybePreQuantifier = {
	"+": handlePlus,
	"*": handleStar,
	"?": handleQmark,
	"{": HandleRange
}

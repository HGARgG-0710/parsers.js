import type { IOwnedStream } from "../../../../interfaces.js"
import { CachedTokenStream } from "../../../../samples/Stream.js"
import { Temp } from "../Nodes.js"
import { HandleRange } from "./Range.js"

const PlusStream = CachedTokenStream(Temp.Plus)
const StarStream = CachedTokenStream(Temp.Star)
const QMarkStream = CachedTokenStream(Temp.QMark)

function handlePlus(input: IOwnedStream<string>) {
	input.next() // +
	return [PlusStream()]
}

function handleStar(input: IOwnedStream<string>) {
	input.next() // *
	return [StarStream()]
}

function handleQmark(input: IOwnedStream<string>) {
	input.next() // ?
	return [QMarkStream()]
}

export const maybePreQuantifier = {
	"+": handlePlus,
	"*": handleStar,
	"?": handleQmark,
	"{": HandleRange
}

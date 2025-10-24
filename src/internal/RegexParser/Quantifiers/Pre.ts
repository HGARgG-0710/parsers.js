import type { array } from "@hgargg-0710/one"
import type { IOwnedStream, IStreamChooser } from "../../../interfaces.js"
import { CachedTokenStream } from "../../../samples/Stream.js"
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

export const maybePreQuantifier: array.Pairs<string, IStreamChooser> = [
	["+", handlePlus],
	["*", handleStar],
	["?", handleQmark],
	["{", HandleRange]
]

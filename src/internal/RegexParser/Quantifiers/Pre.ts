import type { array } from "@hgargg-0710/one"
import type { IOwnedStream, IStreamChooser } from "../../../interfaces.js"
import { TokenStream } from "../../../samples/Stream.js"
import { Plus } from "../Nodes.js"
import { QMark } from "../Nodes.js"
import { HandleRange } from "./Range.js"
import { Star } from "../Nodes.js"

const PlusStream = TokenStream(Plus)
const StarStream = TokenStream(Star)
const QMarkStream = TokenStream(QMark)

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
